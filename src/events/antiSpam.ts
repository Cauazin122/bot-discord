import Guild from '../models/Guild.js';

const messageMap = new Map();

export async function handleAntiSpam(message) {
  try {
    if (!message.guild || message.author.bot) return;
    if (message.member?.permissions?.has('Administrator')) return;

    const guild = await Guild.findOne({ guildId: message.guild.id });
    if (!guild || !guild.antiSpamEnabled) return;

    const userId = message.author.id;
    const now = Date.now();

    if (!messageMap.has(userId)) {
      messageMap.set(userId, []);
    }

    const timestamps = messageMap.get(userId) || [];
    const filtered = timestamps.filter(t => now - t < 5000);

    filtered.push(now);
    messageMap.set(userId, filtered);

    if (filtered.length >= 5) {

      await message.delete().catch(() => {});
      await message.channel.send(`⚠️ ${message.author}, pare de spammar!`).catch(() => {});

      messageMap.set(userId, []);

      // ================================
      // 🚨 VIOLATIONS (SPAM)
      // ================================
      if (!guild.violations) guild.violations = [];
      if (!guild.warns) guild.warns = [];

      let userViolation = guild.violations.find(
        v => v.userId === userId && v.type === 'spam'
      );

      if (!userViolation) {
        userViolation = {
          userId: userId,
          type: 'spam',
          count: 1,
          lastViolation: new Date()
        };
        guild.violations.push(userViolation);
      } else {
        userViolation.count += 1;
        userViolation.lastViolation = new Date();
      }

      // ================================
      // ⚠️ 3 PUNIÇÕES = 2 WARNS
      // ================================
      if (userViolation.count >= 3) {

        guild.warns.push({
          userId: userId,
          reason: 'Spam (AutoMod)',
          staff: 'Sistema',
          date: new Date()
        });

        guild.warns.push({
          userId: userId,
          reason: 'Spam (AutoMod)',
          staff: 'Sistema',
          date: new Date()
        });

        userViolation.count = 0;

        await message.channel.send(
          `⚠️ ${message.author} recebeu 2 warns automáticos por spam.`
        ).catch(() => {});
      }

      await guild.save().catch(console.error);
    }

  } catch (err) {
    console.error('Erro no antiSpam:', err);
  }
}
