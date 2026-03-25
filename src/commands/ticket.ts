import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Criar um ticket'),

  async execute(interaction) {
    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    if (!guildData?.ticketCategory) {
      return interaction.reply({ content: '❌ Categoria de tickets não configurada.', ephemeral: true });
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: guildData.ticketCategory,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: ['ViewChannel']
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle('🎫 Novo Ticket')
      .setDescription(`Olá ${interaction.user}, bem-vindo ao suporte!`)
      .setColor('Blue');

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Fechar Ticket')
          .setStyle(ButtonStyle.Danger)
      );

    await channel.send({ embeds: [embed], components: [row] });

    await interaction.reply({ content: `✅ Ticket criado: ${channel}`, ephemeral: true });
  }
};
