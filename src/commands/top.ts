import fs from "fs";
import path from "path";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("top")
  .setDescription("Mostra o ranking dos usuários com melhores avaliações");

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const dbPath = path.join(process.cwd(), "database.json");

    const dbData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbData);

    if (!db.avaliacoes || db.avaliacoes.length === 0) {
      await interaction.reply({
        content: "Nenhuma avaliação registrada ainda.",
        flags: 64,
      });
      return;
    }

    const userStats: Record<
      string,
      { total: number; soma: number; primeiraData: Date; ultimaData: Date }
    > = {};

    db.avaliacoes.forEach((av: any) => {
      if (!userStats[av.user]) {
        userStats[av.user] = {
          total: 0,
          soma: 0,
          primeiraData: new Date(av.data),
          ultimaData: new Date(av.data),
        };
      }
      userStats[av.user].total++;
      userStats[av.user].soma += parseInt(av.estrelas);
      userStats[av.user].ultimaData = new Date(av.data);
    });

    const ranking = Object.entries(userStats)
      .map(([user, stats]) => ({
        user,
        media: (stats.soma / stats.total).toFixed(2),
        total: stats.total,
        tempoAtendimento: Math.floor(
          (stats.ultimaData.getTime() - stats.primeiraData.getTime()) /
            (1000 * 60)
        ),
      }))
      .sort((a, b) => parseFloat(b.media) - parseFloat(a.media))
      .slice(0, 10);

    const topTexto = ranking
      .map(
        (item, index) =>
          `${index + 1}. ${item.user}\n   ⭐ ${item.media} (${item.total} avaliações)\n   ⏱️ Tempo: ${item.tempoAtendimento}min`
      )
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("🏆 Top 10 Usuários Mais Avaliados")
      .setDescription(topTexto || "Sem dados")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    await interaction.reply({
      content: "Erro ao buscar ranking.",
      flags: 64,
    });
  }
}
