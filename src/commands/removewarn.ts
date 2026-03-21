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
    const numero = interaction.options.getInteger('numero');
const db = readDB();
const guildId = interaction.guild.id;

if (!db.warns[guildId]?.[user.id]) {
  return interaction.reply('Esse usuário não tem avisos.');
}

if (numero) {
  db.warns[guildId][user.id].splice(numero - 1, 1);

  await interaction.reply(`🧹 Warn ${numero} removido de ${user.tag}`);
} else {
  db.warns[guildId][user.id] = [];

  await interaction.reply(`🧹 Todos os warns removidos de ${user.tag}`);
}

writeDB(db);
  }
};
