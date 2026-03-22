import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from 'discord.js';

import { readDB, writeDB } from '../utils/database.js';

export default {
  data: new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Remove warns de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('quantidade')
        .setDescription('Quantidade de warns para remover')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {

    const user = interaction.options.getUser('usuario');
    const quantidade = interaction.options.getInteger('quantidade');

    const db = readDB();

    if (!db.warns) db.warns = {};
    if (!db.warns[user.id]) db.warns[user.id] = 0;

    db.warns[user.id] -= quantidade;

    if (db.warns[user.id] < 0) db.warns[user.id] = 0;

    writeDB(db);

    return interaction.reply({
      content: `⚠️ Foram removidos ${quantidade} warn(s) de ${user.tag}. Agora ele tem ${db.warns[user.id]} warn(s).`
    });
  }
};
