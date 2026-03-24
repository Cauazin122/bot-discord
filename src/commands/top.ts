import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("Ranking de avaliações"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🏆 Top usuários")
      .setDescription("Ranking ainda em desenvolvimento.")
      .setColor("Gold");

    await interaction.reply({ embeds: [embed] });
  }
};
