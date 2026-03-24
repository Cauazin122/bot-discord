import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";

export default {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("Ranking de staff"),

  async execute(interaction) {
    const guild = await GuildConfig.findOne({
      guildId: interaction.guild.id
    });

    if (!guild || !guild.avaliacoes.length) {
      return interaction.reply("Sem avaliações.");
    }

    const stats = {};

    guild.avaliacoes.forEach(av => {
      if (!stats[av.user]) {
        stats[av.user] = { total: 0, soma: 0 };
      }

      stats[av.user].total++;
      stats[av.user].soma += parseInt(av.estrelas);
    });

    const ranking = Object.entries(stats)
      .map(([user, s]: any) => ({
        user,
        media: (s.soma / s.total).toFixed(2),
        total: s.total
      }))
      .sort((a, b) => b.media - a.media)
      .slice(0, 10);

    const text = ranking.map((u, i) =>
      `${i + 1}. ${u.user}\n⭐ ${u.media} (${u.total})`
    ).join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle("🏆 Ranking")
      .setDescription(text)
      .setColor("Gold");

    await interaction.reply({ embeds: [embed] });
  }
};
