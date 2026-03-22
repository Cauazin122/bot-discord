import { EmbedBuilder } from 'discord.js';
import { readDB } from './database';

export async function sendLog(guild, data) {
  try {
    const db = readDB();

    const channelId = db.logs?.[guild.id];
    if (!channelId) return;

    const channel = guild.channels.cache.get(channelId);
    if (!channel) return;

    // 📋 Campos padrão
    const fields = [
      {
        name: '👤 Usuário',
        value: `${data.user.tag} (${data.user.id})`,
        inline: false
      },
      {
        name: '🛡️ Staff',
        value: `${data.staff.tag}`,
        inline: false
      },
      {
        name: '📄 Motivo',
        value: data.reason || 'Não informado',
        inline: false
      }
    ];

    // ⏱️ Campo de tempo (se existir)
    if (data.time) {
      fields.push({
        name: '⏱️ Tempo',
        value: data.time,
        inline: false
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`📋 ${data.action}`)
      .addFields(fields)
      .setColor('Red')
      .setTimestamp();

    await channel.send({ embeds: [embed] });

  } catch (err) {
    console.error('Erro ao enviar log:', err);
  }
}
