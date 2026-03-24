import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("avaliacoes")
    .setDescription("Ver suas avaliações"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("⭐ Avaliações")
      .setDescription("Sistema funcionando corretamente.")
      .setColor("Yellow");

    await interaction.reply({ embeds: [embed] });
  }
};
