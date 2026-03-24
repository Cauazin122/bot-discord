import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("antilink")
    .setDescription("Sistema anti-link"),

  async execute(interaction) {
    await interaction.reply("🔗 Anti-link configurado.");
  }
};
