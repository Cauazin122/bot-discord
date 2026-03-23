import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";

export const data = new SlashCommandBuilder()
  .setName("top")
  .setDescription("Ranking dos melhores atendentes");

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const guildId = interaction.guild!.id;

    const guild = await GuildConfig.findOne({ guildId });

    if (!guild?.avaliacoes.length) {
      return interaction.reply({
        content: "Nenhuma avaliação registrada ainda.",
        ephemeral: true,
      });
    }

    const stats: Record<
      string,
      { total: number; soma: number; primeira: number; ultima: number }
    > = {};

    // 📊 agrupar
    guild.avaliacoes.forEach(av => {
      if (!stats[av.userId]) {
        stats[av.userId] = {
          total: 0,
          soma: 0,
          primeira: new Date(av.date).getTime(),
          ultima: new Date(av.date).getTime(),
        };
      }

      stats[av.userId].total++;
      stats[av.userId].soma += av.nota;

      const time = new Date(av.date).getTime();
      stats[av.userId].ultima = time;
    });

    // 🏆 ranking
    const ranking = Object.entries(stats)
      .map(([userId, s]) => ({
        userId,
        media: (s.soma / s.total).toFixed(2),
        total: s.total,
        tempo: Math.floor((s.ultima - s.primeira) / (1000 * 60)),
      }))
      .sort((a, b) => parseFloat(b.media) - parseFloat(a.media))
      .slice(0, 10);

    // 🎯 texto
    const texto = await Promise.all(
      ranking.map(async (r, i) => {
        const user = await interaction.client.users.fetch(r.userId).catch(() => null);

        return `${i + 1}. ${user?.tag || "Usuário desconhecido"}
   ⭐ ${r.media} (${r.total} avaliações)
   ⏱️ Tempo: ${r.tempo}min`;
      })
    );

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("🏆 Top 10 Atendentes")
      .setDescription(texto.join("\n\n") || "Sem dados")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

  } catch (error) {
    console.error("Erro ao buscar ranking:", error);

    await interaction.reply({
      content: "Erro ao buscar ranking.",
      ephemeral: true,
    });
  }
}
