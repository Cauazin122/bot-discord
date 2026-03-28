import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abrir um novo ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    if (!guildData?.ticketCategory) {
      return interaction.reply({ content: '❌ Categoria de tickets não configurada.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('🎫 Abrir Ticket')
      .setDescription('Selecione o tipo de ticket que deseja abrir:')
      .setColor('Blue');

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('ticket_type')
          .setPlaceholder('Escolha o tipo de ticket...')
          .addOptions(
            { label: 'Suporte', value: 'support', emoji: '🛠️' },
            { label: 'Denúncia', value: 'report', emoji: '🚨' },
            { label: 'Dúvida', value: 'question', emoji: '❓' },
            { label: 'Outro', value: 'other', emoji: '📝' }
          )
      );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
  }
};
