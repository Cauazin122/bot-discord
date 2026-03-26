import Guild from '../models/Guild.js';
import User from '../models/User.js';
import { sendLog } from '../utils/logs.js';

const messageMap = new Map();

export async function handleAntiSpam(message) {
  if (!message.guild || message.author.bot) return;
  if (message.member.permissions.has('Administrator')) return;

  const guild = await Guild.findOne({ guildId: message.guild.id });
  if (!guild?.antiSpamEnabled) return;

  const userId = message.author.id;
  const now = Date.now();

  if (!messageMap.has(userId)) {
    messageMap.set(userId, []);
  }

  const timestamps = messageMap.get(userId);
  const filtered = timestamps.filter(t => now - t < 5000);

  filtered.push(now);
  messageMap.set(userId, filtered);

  if (filtered.length >= 5) {
    try {
      await message.delete();
    } catch {}

    try {
      await message.channel.send(`⚠️ ${message.author}, pare de spammar!`);
    } catch {}

    // Rastrear punição
    let violation = guild.violations.find(v => v.userId === userId && v.type === 'antispam');

    if (!violation) {
      guild.violations.push({
        userId: userId,
        type: 'antispam',
        count: 1,
        lastViolation: new Date()
      });
    } else {
      violation.count += 1;
      violation.lastViolation = new Date();
    }

    await guild.save();

    // 3 punições = 2 warns
    if (violation && violation.count === 3) {
      let userData = await User.findOne({ userId: userId, guildId: message.guild.id });
      if (!userData) {
        userData = await User.create({ userId: userId, guildId: message.guild.id, warns: 2 });
      } else {
        userData.warns += 2;
      }
      await userData.save();

      guild.warns.push({
        userId: userId,
        reason: 'Anti-spam (3 punições)',
        staff: message.client.user.tag,
        date: new Date()
      });

      // Reset violation
      guild.violations = guild.violations.filter(v => !(v.userId === userId && v.type === 'antispam'));
      await guild.save();

      await sendLog(message.guild, {
        action: 'Auto Warn (Anti-Spam)',
        user: message.author,
        staff: message.client.user,
        reason: '3 punições de anti-spam'
      });
    }

    messageMap.set(userId, []);
  }
}
