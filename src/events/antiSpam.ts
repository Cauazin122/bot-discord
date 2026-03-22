const messages = new Map();

export default {
  name: 'messageCreate',

  async execute(message) {
    if (message.author.bot) return;

    const userId = message.author.id;
    const now = Date.now();

    if (!messages.has(userId)) {
      messages.set(userId, []);
    }

    const userMessages = messages.get(userId);

    userMessages.push(now);

    // remove mensagens antigas (5 segundos)
    messages.set(userId, userMessages.filter(t => now - t < 5000));

    const msgCount = messages.get(userId).length;

    // 🚨 SPAM DETECTADO
    if (msgCount >= 5) {
      const member = message.member;

      if (member.permissions.has('ManageMessages')) return;

      if (!member.moderatable) return;

      await member.timeout(5 * 60 * 1000);

      await message.reply('🚫 Você foi mutado por spam.');

      // limpa histórico pra não mutar várias vezes
      messages.set(userId, []);
    }
  }
};
