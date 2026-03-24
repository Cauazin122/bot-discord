import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";
import { sendLog } from "../utils/logs.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Dar warn")
    .addUserOption(o =>
  o.setName("usuario")
    .setDescription("Usuário para ver os warns")
    .setRequired(true)
)
    .addStringOption(o =>
      o.setName("motivo").setDescription("Motivo").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("motivo");
    const guildId = interaction.guild.id;

    let guild = await GuildConfig.findOne({ guildId });
    if (!guild) guild = await GuildConfig.create({ guildId });

    let warns = guild.warns.get(user.id) || [];

    warns.push({
      reason,
      staff: interaction.user.tag
    });

    guild.warns.set(user.id, warns);
    await guild.save();

    const member = interaction.guild.members.cache.get(user.id);

    // 🚨 AUTOMOD
    const total = warns.length;
    const auto = guild.autoMod;

    if (total >= auto.kick) {
      await member.kick().catch(() => {});
    } else if (total >= auto.mute) {
      await member.timeout(10 * 60 * 1000).catch(() => {});
    }

    await interaction.reply(`⚠️ ${user.tag} recebeu um warn (${total}).`);

    await sendLog(interaction.guild, {
      action: "Warn",
      user,
      staff: interaction.user,
      reason
    });
  }
};
