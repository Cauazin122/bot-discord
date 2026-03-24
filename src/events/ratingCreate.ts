import { ButtonInteraction } from "discord.js";
import GuildConfig from "../models/GuildConfig.js";

export async function handleRating(interaction: ButtonInteraction) {
  if (!interaction.customId.startsWith("rate_")) return;

  const rating = interaction.customId.split("_")[1];

  let guild = await GuildConfig.findOne({
    guildId: interaction.guild.id
  });

  if (!guild) guild = await GuildConfig.create({
    guildId: interaction.guild.id
  });

  guild.avaliacoes.push({
    user: interaction.user.tag,
    estrelas: rating
  });

  await guild.save();

  await interaction.reply({
    content: `⭐ Avaliação: ${rating}`,
    ephemeral: true
  });
}
