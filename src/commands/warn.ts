import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Dar warn")
    .addUserOption(o =>
      o.setName("usuario").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("motivo").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("motivo");

    let guild = await GuildConfig.findOne({ guildId: interaction.guild.id });
    if (!guild) guild = await GuildConfig.create({ guildId: interaction.guild.id });

    let warns = guild.warns.get(user.id) || [];

    warns.push({
      reason,
      staff: interaction.user.tag
    });

    guild.warns.set(user.id, warns);
    await guild.save();

    await interaction.reply(`⚠️ ${user.tag} avisado.`);
  }
};
