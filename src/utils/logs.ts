import { EmbedBuilder } from 'discord.js';

const logChannels = {
  "1475319429322510418": "1483071071627378718",
  "1074821077303304292": "1463602167460921547"
};

export async function sendLog(guild, data) {
  const channelId = logChannels[guild.id];
  if (!channelId) return;

  const channel = guild.channels.cache.get(channelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(`📋 ${data.action}`)
    .addFields(
      { name: '👤 Usuário', value: `${data.user.tag} (${data.user.id})` },
      { name: '🛡️ Staff', value: `${data.staff.tag}` },
      { name: '📄 Motivo', value: data.reason }
    )
    .setColor('Red')
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}
