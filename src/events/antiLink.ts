import Guild from '../models/Guild.js';
import User from '../models/User.js';
import { sendLog } from '../utils/logs.js';

export async function handleAntiLink(message) {
  if (!message.guild || message.author.bot) return;
  if (message.member.permissions.has('Administrator')) return;

  const guild = await Guild.findOne({ guildId: message.guild.id });
  if (!guild?.antiLinkEnabled) return;

  const linkRegex = /(https?:\/\/|www\.)/i;
  if (!linkRegex.test(message.content)) return;

  try {
    await message.delete();
    await message.channel.send(`⚠️ ${message.author}, links não são permitidos!`);
  } catch {}

  // Rastrear violação
  let violation = guild.violations.find(v => v.userId === message.author.id && v.type === 'antilink');

  if (!violation) {
    guild.violations.push({
      userId: message.author.id,
      type: 'antilink',
      count: 1,
      lastViolation: new Date()
    });
  } else {
    violation.count += 1;
    violation.lastViolation = new Date();
  }

  await guild.save();

  // 3 violações = 1 warn
  if (violation && violation.count === 3) {
    let userData = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
    if (!userData) {
      userData = await User.create({ userId: message.author.id, guildId: message.guild.id, warns: 1 });
    } else {
      userData.warns += 1;
    }
    await userData.save();

    guild.warns.push({
      userId: message.author.id,
      reason: 'Anti-link (3 violações)',
      staff: message.client.user.tag,
      date: new Date()
    });

    // Reset violation
    guild.violations = guild.violations.filter(v => !(v.userId === message.author.id && v.type === 'antilink'));
    await guild.save();

    await sendLog(message.guild, {
      action: 'Auto Warn (Anti-Link)',
      user: message.author,
      staff: message.client.user,
      reason: '3 violações de anti-link'
    });
  }
}
