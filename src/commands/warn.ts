import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs';
import { readDB, writeDB } from '../utils/database';

const warns = new Map();

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

// contar warns
const count = db.warns[guildId][user.id].length;

    const userWarns = warns.get(user.id) || 0;
    warns.set(user.id, userWarns + 1);

    await interaction.reply(`⚠️ ${user.tag} recebeu um aviso (${count}/3)`);

    await sendLog(interaction.guild!, {
      action: 'Aviso',
      user,
      staff: interaction.user,
      reason
    });

    // Sistema automático
    if (count >= 3) {
  const member = await interaction.guild.members.fetch(user.id);
  await member.timeout(10 * 60 * 1000);

      await interaction.followUp(`🔇 ${user.tag} foi mutado automaticamente por excesso de avisos.`);
    }
  }
};
