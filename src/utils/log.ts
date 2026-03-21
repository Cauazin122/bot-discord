import { EmbedBuilder } from 'discord.js';

const logChannels = {
  "SERVIDOR_REAL_ID": "1483071071627378718",
  "SERVIDOR_TESTE_ID": "1463602167460921547"
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
