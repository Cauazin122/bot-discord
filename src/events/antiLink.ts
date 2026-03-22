import { readDB } from '../utils/database';

const linkRegex = /(https?:\/\/|www\.)\S+/i;

export default {
  name: 'messageCreate',

  async execute(message) {
    if (message.author.bot) return;

    const member = message.member;
    const db = readDB();
    const guildId = message.guild.id;
    const channelId = message.channel.id;

    // 🛡️ Ignorar staff
    if (member.permissions.has('ManageMessages')) return;

    // 🚫 Se não tiver config, sai
    if (!db.antiLink[guildId]) return;

    // 🚫 Se o canal não estiver na lista, sai
    if (!db.antiLink[guildId].includes(channelId)) return;

    // 🔍 Detectar link
    if (linkRegex.test(message.content)) {
      try {
        await message.delete();

        await message.reply('🚫 Links não são permitidos neste canal.');
      } catch (err) {
        console.error('Erro ao deletar mensagem:', err);
      }
    }
  }
};
