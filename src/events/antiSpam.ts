import { readDB } from '../utils/database';

const userMessages = new Map();

export default {
  name: 'messageCreate',

  async execute(message) {
    if (!message.guild || message.author.bot) return;

    console.log('📩 Mensagem recebida:', message.content);

    const db = readDB();

    if (!db.antiSpam) db.antiSpam = {};

    const guildId = message.guild.id;

    // 🔥 DEBUG
    console.log('Config antiSpam:', db.antiSpam[guildId]);

    if (!db.antiSpam[guildId]?.enabled) return;

    // Ignora staff
    if (message.member.permissions.has('Administrator')) return;

    const now = Date.now();
    const userId = message.author.id;

    if (!userMessages.has(userId)) {
      userMessages.set(userId, []);
    }

    const timestamps = userMessages.get(userId);

    // mantém apenas últimos 5s
    const filtered = timestamps.filter(t => now - t < 5000);

    filtered.push(now);
    userMessages.set(userId, filtered);

    console.log(`📊 ${filtered.length} mensagens em 5s`);

    if (filtered.length >= 5) {
      console.log('🚫 SPAM DETECTADO');

      try {
        await message.channel.bulkDelete(5, true);

        await message.member.timeout(10 * 60 * 1000, 'Spam');

        await message.channel.send({
          content: `🚫 ${message.author}, você foi mutado por spam.`
        });

      } catch (err) {
        console.error('Erro anti-spam:', err);
      }

      userMessages.delete(userId);
    }
  }
};
