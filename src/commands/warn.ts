import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { readDB, writeDB } from '../utils/database';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avisar um membro')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');

    const db = readDB();
    const guildId = interaction.guild.id;

    // cria servidor
    if (!db.warns[guildId]) {
      db.warns[guildId] = {};
    }

    // cria usuário
    if (!db.warns[guildId][user.id]) {
      db.warns[guildId][user.id] = [];
    }

    // adiciona warn
    db.warns[guildId][user.id].push({
      reason,
      staff: interaction.user.id,
      date: new Date().toISOString()
    });

    writeDB(db);

    const count = db.warns[guildId][user.id].length;

    await interaction.reply(`⚠️ ${user.tag} recebeu um aviso (${count}/3)`);

    // 🔥 SISTEMA AUTOMÁTICO
    const member = await interaction.guild.members.fetch(user.id);

    if (count === 3) {
      await member.timeout(10 * 60 * 1000);
      await interaction.followUp(`🔇 ${user.tag} foi mutado (3 avisos).`);
    }

    if (count === 5) {
      await member.kick(reason);
      await interaction.followUp(`👢 ${user.tag} foi expulso (5 avisos).`);
    }

    if (count >= 7) {
      await member.ban({ reason });
      await interaction.followUp(`🔨 ${user.tag} foi banido (7 avisos).`);
    }
  }
};
