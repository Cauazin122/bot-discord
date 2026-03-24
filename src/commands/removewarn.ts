import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from "discord.js";

import { readDB, writeDB } from "../utils/database.js";

export default {
  data: new SlashCommandBuilder()
    .setName("removewarn")
    .setDescription("Remove warn de um usuário")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o =>
      o
        .setName("usuario")
        .setDescription("Usuário alvo")
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o
        .setName("numero")
        .setDescription("Número do warn (opcional)")
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const num = interaction.options.getInteger("numero");
    const guildId = interaction.guild.id;

    const db = readDB();

    if (!db.warns) db.warns = {};
    if (!db.warns[guildId]) db.warns[guildId] = {};

    let warns = db.warns[guildId][user.id] || [];

    if (!warns.length) {
      return interaction.reply({
        content: "❌ Esse usuário não possui warns.",
        ephemeral: true
      });
    }

    if (num) {
      warns.splice(num - 1, 1);
    } else {
      warns = [];
    }

    db.warns[guildId][user.id] = warns;
    writeDB(db);

    await interaction.reply({
      content: `✅ Warn removido. Total: ${warns.length}`,
      ephemeral: true
    });
  }
};
