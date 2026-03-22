import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction
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
        .setDescription('Número do warn (opcional)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('usuario');
    const numero = interaction.options.getInteger('numero');

    const db = readDB();

    if (!db.warns[user.id] || db.warns[user.id].length === 0) {
      return interaction.reply({
        content: '❌ Esse usuário não possui warns.',
        ephemeral: true
      });
    }

    // 🔥 REMOVE TODOS OS WARNS
    if (!numero) {
      db.warns[user.id] = [];

      writeDB(db);

      return interaction.reply({
        content: `✅ Todos os warns de ${user.tag} foram removidos.`
      });
    }

    // 🔥 REMOVE WARN ESPECÍFICO
    const index = numero - 1;

    if (!db.warns[user.id][index]) {
      return interaction.reply({
        content: '❌ Warn inválido.',
        ephemeral: true
      });
    }

    db.warns[user.id].splice(index, 1);

    writeDB(db);

    return interaction.reply({
      content: `✅ Warn ${numero} removido de ${user.tag}.`
    });
  }
};
