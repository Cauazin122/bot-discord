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
  } catch {}
}
