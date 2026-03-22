import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { readDB, writeDB } from '../utils/database';
import { sendLog } from '../utils/logs';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Advertir um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do aviso')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');

    const db = readDB();
    const guildId = interaction.guild.id;

    if (!db.warns[guildId]) {
      db.warns[guildId] = {};
    }

    if (!db.warns[guildId][user.id]) {
      db.warns[guildId][user.id] = [];
    }

    db.warns[guildId][user.id].push({
      reason,
      staff: interaction.user.tag,
      date: new Date().toISOString()
    });

    writeDB(db);

    await interaction.reply(`⚠️ ${user.tag} recebeu um aviso.`);

    await sendLog(interaction.guild, {
      action: 'Warn aplicado',
      user,
      staff: interaction.user,
      reason
    });
  }
};
