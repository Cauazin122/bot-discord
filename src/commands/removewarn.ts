import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { readDB, writeDB } from '../utils/database';

export default {
  data: new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Remover avisos de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('numero')
    .setDescription('Número do warn (opcional)')
    .setRequired(true)
)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const db = readDB();
    const guildId = interaction.guild.id;

    if (db.warns[guildId] && db.warns[guildId][user.id]) {
      db.warns[guildId][user.id] = [];
    }

    writeDB(db);

    await interaction.reply(`🧹 Avisos de ${user.tag} foram removidos.`);
  }
};
