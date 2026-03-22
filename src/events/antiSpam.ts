import { readDB, writeDB } from '../utils/database';

const userMessages = new Map();

export default {
  name: 'messageCreate',

  async execute(message) {
    if (!message.guild || message.author.bot) return;

    const db = readDB();

    // Se não tiver config, cria
    if (!db.antiSpam) db.antiSpam = {};

    const guildId = message.guild.id;

    // Se anti-spam não estiver ativo
    if (!db.antiSpam[guildId]?.enabled) return;

    // Ignorar staff
    if (message.member.permissions.has('Administrator')) return;

    const now = Date.now();
    const userId = message.author.id;

    if (!userMessages.has(userId)) {
      userMessages.set(userId, []);
    }

    const timestamps = userMessages.get(userId);

    // Remove mensagens antigas (5s)
    const filtered = timestamps.filter(time => now - time < 5000);

    filtered.push(now);
    userMessages.set(userId, filtered);

    // Se mandou 5 mensagens em 5 segundos
    if (filtered.length >= 5) {

      try {
        // Deleta mensagens
        await message.channel.bulkDelete(5, true);

        // Timeout 10 minutos
        await message.member.timeout(10 * 60 * 1000, 'Spam');

        message.channel.send({
          content: `🚫 ${message.author}, você foi mutado por spam.`,
        });

      } catch (err) {
        console.error('Erro anti-spam:', err);
      }

      userMessages.delete(userId);
    }
  }
};
