import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Informações do bot"),

  async execute(interaction) {
    await interaction.reply("🤖 Bot online e funcionando.");
  }
};
