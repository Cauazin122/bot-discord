import { ButtonInteraction } from "discord.js";
import GuildConfig from "../models/GuildConfig.js";

export async function handleRatingInteraction(interaction: ButtonInteraction) {
  const customId = interaction.customId;

  if (!["rate_1", "rate_2", "rate_3", "rate_4", "rate_5"].includes(customId))
    return;

  const rating = parseInt(customId.replace("rate_", ""));
  const guildId = interaction.guild?.id;

  try {
    if (!guildId) {
      return interaction.reply({
        content: "Erro: servidor não encontrado.",
        ephemeral: true,
      });
    }

    // 🔥 pega ou cria servidor
    let guild = await GuildConfig.findOne({ guildId });

    if (!guild) {
      guild = await GuildConfig.create({ guildId });
    }

    // 🔥 salva avaliação (mesma lógica do seu sistema)
    guild.avaliacoes.push({
      userId: interaction.user.id,
      nota: rating,
      comentario: "Sem comentário",
      staff: "Sistema",
      date: new Date().toLocaleString(),
    });

    await guild.save();

    // ✅ resposta (igual antes)
    await interaction.reply({
      content: `Avaliação salva: ${rating} ⭐`,
      ephemeral: true,
    });

  } catch (error) {
    console.error("Erro ao registrar avaliação:", error);

    if (!interaction.replied) {
      await interaction.reply({
        content: "Erro ao registrar avaliação.",
        ephemeral: true,
      });
    }
  }
}
