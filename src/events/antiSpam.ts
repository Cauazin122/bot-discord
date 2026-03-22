import { addWarnAuto } from '../utils/autoMod.js';

const messageMap = new Map();

export default {
  name: 'messageCreate',

  async execute(message) {
    if (!message.guild) return;
    if (message.author.bot) return;

    // 🔥 Ignora staff
    if (message.member.permissions.has('Administrator')) return;

    const userId = message.author.id;
    const now = Date.now();

    if (!messageMap.has(userId)) {
      messageMap.set(userId, []);
    }

    const timestamps = messageMap.get(userId);

    // 🔥 remove mensagens antigas (5s)
    const filtered = timestamps.filter(t => now - t < 5000);

    filtered.push(now);
    messageMap.set(userId, filtered);

    // 🔥 limite (5 mensagens em 5s)
    if (filtered.length >= 5) {

      try {
        await message.delete();
      } catch {}

      await addWarnAuto(
        message.member,
        'Spam detectado',
        message.client.user
      );

      await message.channel.send({
        content: `⚠️ ${message.author}, pare de spammar!`,
      });

      messageMap.set(userId, []); // reset
    }
  }
};
