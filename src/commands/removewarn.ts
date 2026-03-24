import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";

export default {
  data: new SlashCommandBuilder()
    .setName("removewarn")
    .setDescription("Remover warn de um usuário")
    .addUserOption(o =>
      o.setName("usuario")
        .setDescription("Usuário")
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName("numero")
        .setDescription("Número do warn (opcional)")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const num = interaction.options.getInteger("numero");

    const guild = await GuildConfig.findOne({ guildId: interaction.guild.id });

    let warns = guild.warns.get(user.id) || [];

    if (!warns.length) {
      return interaction.reply("❌ Sem warns.");
    }

    if (num) {
      warns.splice(num - 1, 1);
    } else {
      warns = [];
    }

    guild.warns.set(user.id, warns);
    await guild.save();

    await interaction.reply("✅ Warn removido.");
  }
};
