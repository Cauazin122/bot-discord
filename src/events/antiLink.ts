import { readDB } from '../utils/database.js';
import { addWarnAuto } from '../utils/autoMod.js';

const cooldown = new Map();

export default {
  name: 'messageCreate',

  async execute(message) {
    if (!message.guild) return;
    if (message.author.bot) return;

    const db = readDB();
    const guildId = message.guild.id;
    const channelId = message.channel.id;

    // 🔥 Verifica se anti-link está ativo no canal
    if (!db.antiLink || !db.antiLink[guildId]) return;
    if (!db.antiLink[guildId].includes(channelId)) return;

    // 🔥 Ignora staff
    if (message.member.permissions.has('Administrator')) return;

    // 🔥 Detecta link
    const linkRegex = /(https?:\/\/|www\.)/i;

    if (!linkRegex.test(message.content)) return;

    // 🔥 cooldown anti flood
    if (cooldown.has(message.author.id)) return;

    cooldown.set(message.author.id, true);
    setTimeout(() => cooldown.delete(message.author.id), 5000);

    try {
      await message.delete();
    } catch {}

    await addWarnAuto(
      message.member,
      'Envio de link proibido',
      message.client.user
    );

    await message.channel.send({
      content: `⚠️ ${message.author}, links não são permitidos aqui!`,
    });
  }
};
