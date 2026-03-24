import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configurar bot"),

  async execute(interaction) {
    await interaction.reply("⚙️ Painel de configuração em breve.");
  }
};
