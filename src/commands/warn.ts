import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";
import { sendLog } from "../utils/logs.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Aplicar warn em um usuário")
    .addUserOption(o =>
      o.setName("usuario")
        .setDescription("Usuário a ser avisado")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("motivo")
        .setDescription("Motivo do warn")
        .setRequired(true)
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

    await interaction.reply(`⚠️ ${user.tag} recebeu um warn.`);

    await sendLog(interaction.guild, {
      action: "Warn",
      user,
      staff: interaction.user,
      reason
    });
  }
};
