import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../models/User.js';

export default {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Top 10 membros com melhor avaliação'),

  async execute(interaction) {
    const users = await User.find({ guildId: interaction.guild.id })
      .sort({ totalRating: -1 })
      .limit(10);

    if (!users.length) {
      return interaction.reply({ content: '❌ Sem dados.', ephemeral: true });
    }

    const description = await Promise.all(
      users.map(async (u, i) => {
        const user = await interaction.client.users.fetch(u.userId);
        const avg = u.ratingCount > 0 ? (u.totalRating / u.ratingCount).toFixed(2) : '0.00';
        return `**${i + 1}.** ${user.tag} - ${avg}⭐`;
      })
    );

    const embed = new EmbedBuilder()
      .setTitle('🏆 Top 10 Membros')
      .setDescription(description.join('\n'))
      .setColor('Gold');

    await interaction.reply({ embeds: [embed] });
  }
};
