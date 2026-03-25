import Guild from '../models/Guild.js';

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

    // ================================
    // 🚨 SISTEMA DE VIOLATIONS
    // ================================
    let userViolation = guild.violations.find(
      v => v.userId === message.author.id && v.type === 'link'
    );

    if (!userViolation) {
      guild.violations.push({
        userId: message.author.id,
        type: 'link',
        count: 1,
        lastViolation: new Date()
      });
    } else {
      userViolation.count += 1;
      userViolation.lastViolation = new Date();
    }

    // pega novamente atualizado
    userViolation = guild.violations.find(
      v => v.userId === message.author.id && v.type === 'link'
    );

    // ================================
    // ⚠️ 3 VIOLAÇÕES = WARN
    // ================================
    if (userViolation.count >= 3) {

      guild.warns.push({
        userId: message.author.id,
        reason: 'Envio de links (AutoMod)',
        staff: 'Sistema',
        date: new Date()
      });

      // reseta contador (opcional mas recomendado)
      userViolation.count = 0;

      await message.channel.send(
        `⚠️ ${message.author} recebeu um warn automático por envio de links.`
      );
    }

    await guild.save();

  } catch (err) {
    console.error(err);
  }
}
