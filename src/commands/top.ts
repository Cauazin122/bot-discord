import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Top 10 staffs com melhor avaliação'),

  async execute(interaction) {
    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    if (!guildData?.ratings.length) {
      return interaction.reply({ content: '❌ Sem avaliações ainda.', ephemeral: true });
    }

    const staffRatings = new Map();
    guildData.ratings.forEach(r => {
      if (!staffRatings.has(r.staffId)) {
        staffRatings.set(r.staffId, { tag: r.staffTag, ratings: [] });
      }
      staffRatings.get(r.staffId).ratings.push(r.stars);
    });

    const topStaff = Array.from(staffRatings.entries())
      .map(([id, data]) => ({
        id,
        tag: data.tag,
        avg: (data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(2),
        count: data.ratings.length
      }))
      .sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg))
      .slice(0, 10);

    const description = topStaff
      .map((s, i) => `**${i + 1}.** ${s.tag} - ${s.avg}⭐ (${s.count})`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle('🏆 Top 10 Staffs')
      .setDescription(description)
      .setColor('Gold')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
