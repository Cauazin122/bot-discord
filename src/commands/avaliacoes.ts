import fs from "fs";
import path from "path";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("avaliacoes")
  .setDescription("Mostra suas avaliações de tickets")
  .setDefaultMemberPermissions(0);

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const dbPath = path.join(process.cwd(), "database.json");

    const dbData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbData);

    const userTag = interaction.user.tag;
    const userAvaliacoes = db.avaliacoes.filter(
      (av: any) => av.user === userTag
    );

    if (!userAvaliacoes || userAvaliacoes.length === 0) {
      const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("⭐ Minhas Avaliações")
        .setThumbnail(interaction.user.avatarURL())
        .setDescription("Você ainda não foi avaliado por nenhum membro!")
        .addFields(
          {
            name: "ℹ️ Como receber avaliações?",
            value: "Quando um membro fecha um ticket que você atendeu, ele receberá botões de avaliação (⭐) para avaliar o seu atendimento. Suas avaliações aparecerão aqui!",
            inline: false,
          }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const totalAvaliacoes = userAvaliacoes.length;
    const somaEstrelas = userAvaliacoes.reduce(
      (sum: number, av: any) => sum + parseInt(av.estrelas),
      0
    );
    const mediaEstrelas = (somaEstrelas / totalAvaliacoes).toFixed(2);

    const avaliacoesTexto = userAvaliacoes
      .reverse()
      .map((av: any) => {
        const data = new Date(av.data).toLocaleDateString("pt-BR");
        const feedback = av.feedback ? `\n   _"${av.feedback}"_` : "";
        return `${av.estrelas}⭐ - ${data}${feedback}`;
      })
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("⭐ Minhas Avaliações")
      .setThumbnail(interaction.user.avatarURL())
      .addFields(
        {
          name: "📊 Estatísticas",
          value: `Total: ${totalAvaliacoes} | Média: ${mediaEstrelas}⭐`,
          inline: false,
        },
        {
          name: "📋 Histórico",
          value: avaliacoesTexto || "Sem avaliações",
          inline: false,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    await interaction.reply({
      content: "Erro ao buscar avaliações.",
      flags: 64,
    });
  }
}
