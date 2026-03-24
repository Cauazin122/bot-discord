import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ver latência"),

  async execute(interaction) {
    await interaction.reply("🏓 Pong!");
  }
};
