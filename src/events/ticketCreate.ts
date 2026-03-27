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

const typeLabels = {
  support: '🛠️ Suporte',
  report: '🚨 Denúncia',
  question: '❓ Dúvida',
  other: '📝 Outro'
};

export async function handleTicketCreate(interaction: StringSelectMenuInteraction) {
  const ticketType = interaction.values[0];
  const guildData = await Guild.findOne({ guildId: interaction.guild.id });

  if (!guildData?.ticketCategory) {
    return interaction.reply({ content: '❌ Categoria de tickets não configurada.', ephemeral: true });
  }

  const label = typeLabels[ticketType] ?? ticketType;

  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    type: ChannelType.GuildText,
    parent: guildData.ticketCategory,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
      },
      // Allow staff roles to view the ticket
      ...guildData.staffRoles.map(roleId => ({
        id: roleId,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
      }))
    ]
  });

  const embed = new EmbedBuilder()
    .setTitle(`🎫 Ticket — ${label}`)
    .setDescription(`Olá ${interaction.user}, bem-vindo ao suporte!\n\nTipo: **${label}**\n\nAguarde, um membro da staff irá atendê-lo em breve.`)
    .setColor('Blue')
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>()
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

  await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
  await interaction.reply({ content: `✅ Ticket criado: ${channel}`, ephemeral: true });
}
