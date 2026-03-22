import { readDB, writeDB } from './database.js';
import { sendLog } from './logs.js';

export async function addWarnAuto(member, reason, staff) {

  // 🔥 IGNORA STAFF
  if (
    member.permissions.has('Administrator') ||
    member.permissions.has('ManageMessages') ||
    member.permissions.has('KickMembers')
  ) return;

  const db = readDB();
  const guildId = member.guild.id;
  const userId = member.id;

  if (!db.warns[guildId]) db.warns[guildId] = {};
  if (!db.warns[guildId][userId]) db.warns[guildId][userId] = [];

  if (!db.autoMod[guildId]) {
    db.autoMod[guildId] = { mute: 3, kick: 5 };
  }

  db.warns[guildId][userId].push({
    reason,
    staff: staff.tag,
    date: new Date().toLocaleString()
  });

  const total = db.warns[guildId][userId].length;
  const config = db.autoMod[guildId];

  writeDB(db);

  await sendLog(member.guild, {
    action: 'Auto Warn',
    user: member.user,
    staff,
    reason: `${reason} (Total: ${total})`
  });

  // 🔇 MUTE
  if (total === config.mute) {
    await member.timeout(10 * 60 * 1000);

    await sendLog(member.guild, {
      action: 'Auto Mute',
      user: member.user,
      staff,
      reason: `${config.mute} warns`
    });
  }

  // 👢 KICK
  if (total === config.kick) {
    await member.kick('Limite de warns atingido');

    await sendLog(member.guild, {
      action: 'Auto Kick',
      user: member.user,
      staff,
      reason: `${config.kick} warns`
    });
  }
}
