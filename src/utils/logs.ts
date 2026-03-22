import { EmbedBuilder } from 'discord.js';
import { readDB } from './database';

export async function sendLog(guild, data) {
  const db = readDB();

  const channelId = db.logs[guild.id];
  if (!channelId) return;

  const channel = guild.channels.cache.get(channelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(`📋 ${data.action}`)
    .addFields(
      { name: '👤 Usuário', value: `${data.user.tag} (${data.user.id})` },
      { name: '🛡️ Staff', value: `${data.staff.tag}` },
      { name: '📄 Motivo', value: data.reason || 'Não informado' }
    )
    .setColor('Red')
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}
