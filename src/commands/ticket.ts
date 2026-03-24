import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Abrir painel de ticket"),

  async execute(interaction) {
    await interaction.reply("🎫 Painel enviado.");
  }
};
