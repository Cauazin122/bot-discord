import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warns")
    .setDescription("Ver warns de um usuário")
    .addUserOption(o =>
      o.setName("usuario")
        .setDescription("Usuário para ver warns")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");

    const guild = await GuildConfig.findOne({ guildId: interaction.guild.id });

    const warns = guild?.warns.get(user.id) || [];

    if (!warns.length) {
      return interaction.reply("❌ Esse usuário não possui warns.");
    }

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Warns de ${user.tag}`)
      .setDescription(
        warns.map((w, i) => `**${i + 1}.** ${w.reason}`).join("\n")
      );

    await interaction.reply({ embeds: [embed] });
  }
};
