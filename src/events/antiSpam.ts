import Guild from '../models/Guild.js';

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

    messageMap.set(userId, []);
  }
}
