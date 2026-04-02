import {
  StringSelectMenuInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits
} from 'discord.js';
import Guild from '../models/Guild.js';

const TICKET_TYPES: Record<string, { label: string; emoji: string; color: 'Blue' | 'Red' | 'Yellow' | 'Purple' }> = {
  support:  { label: 'Suporte',   emoji: '🆘', color: 'Blue'   },
  report:   { label: 'Denúncia',  emoji: '⚠️', color: 'Red'    },
  question: { label: 'Pergunta',  emoji: '❓', color: 'Yellow' },
  other:    { label: 'Outro',     emoji: '📝', color: 'Purple' }
};

export async function handleTicketCreate(interaction: StringSelectMenuInteraction) {
  const ticketType = interaction.values[0];
  const typeData = TICKET_TYPES[ticketType];

  if (!typeData) {
    return interaction.reply({ content: '❌ Tipo de ticket inválido.', ephemeral: true });
  }

  const guild = await Guild.findOne({ guildId: interaction.guild.id });

  if (!guild?.ticketCategory) {
    return interaction.reply({
      content: '❌ Categoria de tickets não configurada. Contate um administrador.',
      ephemeral: true
    });
  }

  // Defer early to avoid the 3-second interaction timeout while creating the channel
  await interaction.deferReply({ ephemeral: true });

  try {
    // Verify the category channel exists and is the right type
    const category = await interaction.guild.channels.fetch(guild.ticketCategory).catch(() => null);
    if (!category || category.type !== ChannelType.GuildCategory) {
      return interaction.editReply({ content: '❌ Categoria de tickets não encontrada. Contate um administrador.' });
    }

    // Build permission overwrites — start with @everyone deny + user allow
    const permissionOverwrites: Parameters<typeof interaction.guild.channels.create>[0]['permissionOverwrites'] = [
      {
        id: interaction.guild.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
      }
    ];

    // Add each staff role individually so a single bad ID doesn't abort the whole create
    if (guild.staffRoles?.length) {
      for (const roleId of guild.staffRoles) {
        permissionOverwrites.push({
          id: roleId,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
        });
      }
    }

    const ticketNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const channelName = `${ticketType}-${interaction.user.username}-${ticketNumber}`;

    const ticketChannel = await interaction.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: guild.ticketCategory,
      permissionOverwrites
    });

    // Welcome embed
    const welcomeEmbed = new EmbedBuilder()
      .setTitle(`${typeData.emoji} Ticket — ${typeData.label}`)
      .setDescription(
        `Bem-vindo ao seu ticket, ${interaction.user}!\n\n` +
        `Descreva seu problema ou dúvida abaixo. Nossa equipe responderá em breve.`
      )
      .addFields(
        { name: '📋 Tipo',      value: typeData.label,                                    inline: true  },
        { name: '👤 Usuário',   value: interaction.user.tag,                              inline: true  },
        { name: '⏰ Criado em', value: `<t:${Math.floor(Date.now() / 1000)}:f>`,          inline: false }
      )
      .setColor(typeData.color)
      .setTimestamp();

    const actionRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('claim_ticket')
          .setLabel('📌 Assumir Ticket')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('🔒 Fechar Ticket')
          .setStyle(ButtonStyle.Danger)
      );

    await ticketChannel.send({ content: `${interaction.user}`, embeds: [welcomeEmbed], components: [actionRow] });

    // Confirm to the user
    const successEmbed = new EmbedBuilder()
      .setTitle('✅ Ticket Criado')
      .setDescription(`Seu ticket foi criado com sucesso!\n\n${ticketChannel}`)
      .setColor('Green')
      .setTimestamp();

    await interaction.editReply({ embeds: [successEmbed] });

    // Log to log channel if configured
    if (guild.logChannel) {
      try {
        const logChannel = await interaction.guild.channels.fetch(guild.logChannel).catch(() => null);
        if (logChannel?.isTextBased()) {
          const logEmbed = new EmbedBuilder()
            .setTitle('🎫 Novo Ticket')
            .addFields(
              { name: '👤 Usuário', value: interaction.user.tag,        inline: true  },
              { name: '📋 Tipo',    value: typeData.label,               inline: true  },
              { name: '🔗 Canal',   value: ticketChannel.toString(),     inline: false }
            )
            .setColor('Blue')
            .setTimestamp();

          await logChannel.send({ embeds: [logEmbed] });
        }
      } catch (err) {
        console.error('Erro ao enviar log de ticket:', err);
      }
    }
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    try {
      await interaction.editReply({ content: '❌ Erro ao criar ticket. Tente novamente mais tarde.' });
    } catch {}
  }
}
