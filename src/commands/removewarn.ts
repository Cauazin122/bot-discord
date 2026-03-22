import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from 'discord.js';

import { readDB, writeDB } from '../utils/database.js';

export default {
  data: new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Remover warns de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('numero')
        .setDescription('Número do warn')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const numero = interaction.options.getInteger('numero');

    const db = readDB();
    const guildId = interaction.guild.id;

    if (!db.warns[guildId]) db.warns[guildId] = {};
    if (!db.warns[guildId][user.id]) db.warns[guildId][user.id] = [];

    const userWarns = db.warns[guildId][user.id];

    if (userWarns.length === 0) {
      return interaction.reply({
        content: '❌ Esse usuário não possui warns.',
        ephemeral: true
      });
    }

    // 🔥 remover todos
    if (!numero) {
      db.warns[guildId][user.id] = [];
      writeDB(db);

      return interaction.reply({
        content: `✅ Todos os warns de ${user.tag} foram removidos.`
      });
    }

    const index = numero - 1;

    if (!userWarns[index]) {
      return interaction.reply({
        content: '❌ Warn inválido.',
        ephemeral: true
      });
    }

    userWarns.splice(index, 1);
    writeDB(db);

    return interaction.reply({
      content: `✅ Warn ${numero} removido de ${user.tag}.`
    });
  }
};
