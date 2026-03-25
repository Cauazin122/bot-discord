import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avaliacoes')
    .setDescription('Ver suas avaliações'),

  async execute(interaction) {
    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    if (!guildData) {
      return interaction.reply({ content: '❌ Servidor não configurado.', ephemeral: true });
    }

    const ratings = guildData.ratings.filter(r => r.userId === interaction.user.id);
    if (!ratings.length) {
      const embed = new EmbedBuilder()
        .setTitle('⭐ Minhas Avaliações')
        .setDescription('Você ainda não foi avaliado!')
        .setColor('Gold');
      return interaction.reply({ embeds: [embed] });
    }

    const avg = (ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length).toFixed(2);
    const description = ratings
      .map(r => `${'⭐'.repeat(r.stars)} - ${r.feedback || 'Sem feedback'}`)
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setTitle('⭐ Minhas Avaliações')
      .addFields(
        { name: 'Média', value: `${avg}⭐` },
        { name: 'Total', value: `${ratings.length}` },
        { name: 'Histórico', value: description }
      )
      .setColor('Gold');

    await interaction.reply({ embeds: [embed] });
  }
};
