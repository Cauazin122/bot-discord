import { readDB, writeDB } from './database.js';
import { sendLog } from './logs.js';

export async function addWarnAuto(member, reason, staff) {
  const db = readDB();
  const guildId = member.guild.id;
  const userId = member.id;

  if (!db.warns[guildId]) db.warns[guildId] = {};
  if (!db.warns[guildId][userId]) db.warns[guildId][userId] = [];

  db.warns[guildId][userId].push({
    reason,
    staff: staff.tag,
    date: new Date().toLocaleString()
  });

  const total = db.warns[guildId][userId].length;

  writeDB(db);

  // 📜 LOG DO WARN
  await sendLog(member.guild, {
    action: 'Auto Warn',
    user: member.user,
    staff,
    reason: `${reason} (Total: ${total})`
  });

  // 🔥 PUNIÇÕES AUTOMÁTICAS

  // 3 warns = mute
  if (total === 3) {
    await member.timeout(10 * 60 * 1000); // 10 min

    await sendLog(member.guild, {
      action: 'Auto Mute',
      user: member.user,
      staff,
      reason: '3 warns acumulados (10 min)'
    });
  }

  // 5 warns = kick
  if (total === 5) {
    await member.kick('5 warns acumulados');

    await sendLog(member.guild, {
      action: 'Auto Kick',
      user: member.user,
      staff,
      reason: '5 warns acumulados'
    });
  }
}
