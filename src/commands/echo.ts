import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Repete mensagem")
    .addStringOption(o =>
      o.setName("texto")
        .setDescription("Mensagem")
        .setRequired(true)
    ),

  async execute(interaction) {
    const texto = interaction.options.getString("texto");

    await interaction.reply(texto);
  }
};
