import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";

export default {
  data: new SlashCommandBuilder()
    .setName("avaliacoes")
    .setDescription("Ver avaliações"),
  
export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const guildId = interaction.guild!.id;
    const userId = interaction.user.id;

    const guild = await GuildConfig.findOne({ guildId });

    const userAvaliacoes =
      guild?.avaliacoes.filter(av => av.userId === userId) || [];

    // ❌ sem avaliações
    if (!userAvaliacoes.length) {
      const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("⭐ Minhas Avaliações")
        .setThumbnail(interaction.user.displayAvatarURL())
        .setDescription("Você ainda não foi avaliado por nenhum membro!")
        .addFields({
          name: "ℹ️ Como receber avaliações?",
          value:
            "Quando um membro fecha um ticket que você atendeu, ele poderá te avaliar com estrelas ⭐.",
        })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // 📊 cálculos
    const total = userAvaliacoes.length;

    const soma = userAvaliacoes.reduce(
      (sum, av) => sum + av.nota,
      0
    );

    const media = (soma / total).toFixed(2);

    // 📋 histórico
    const texto = userAvaliacoes
      .slice()
      .reverse()
      .map(av => {
        const data = new Date(av.date).toLocaleDateString("pt-BR");
        return `${av.nota}⭐ - ${data}`;
      })
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("⭐ Minhas Avaliações")
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        {
          name: "📊 Estatísticas",
          value: `Total: ${total} | Média: ${media}⭐`,
        },
        {
          name: "📋 Histórico",
          value: texto || "Sem avaliações",
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);

    await interaction.reply({
      content: "Erro ao buscar avaliações.",
      ephemeral: true,
    });
  }
}
