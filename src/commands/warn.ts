import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warns")
    .setDescription("Ver warns de um usuário")
    .addUserOption(option =>
      option.setName("usuario").setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const guildId = interaction.guild.id;

    const guild = await GuildConfig.findOne({ guildId });

    const warns = guild?.warns?.get(user.id) || [];
    const config = guild?.autoMod || { mute: 3, kick: 5 };

    if (!warns.length) {
      return interaction.reply("❌ Sem warns.");
    }

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Warns de ${user.tag}`)
      .setDescription(
        warns.map((w, i) =>
          `**${i + 1}.** ${w.reason} (${w.staff})`
        ).join("\n")
      )
      .addFields({
        name: "⚙️ AutoMod",
        value: `Mute: ${config.mute}\nKick: ${config.kick}`
      });

    await interaction.reply({ embeds: [embed] });
  }
};
