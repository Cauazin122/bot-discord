import { EmbedBuilder } from "discord.js";
import { readDB } from "./database.js";

export async function sendLog(guild, data) {
  const db = readDB();
  const logChannelId = db.logs?.[guild.id];

  if (!logChannelId) return;

  const channel = guild.channels.cache.get(logChannelId);
  if (!channel || !channel.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setTitle(`📋 ${data.action}`)
    .addFields(
      { name: '👤 Usuário', value: `${data.user.tag}` },
      { name: '🛡️ Staff', value: `${data.staff.tag}` },
      { name: '📄 Motivo', value: data.reason }
    )
    .setColor('Red')
    .setTimestamp();

  try {
    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error('Erro ao enviar log:', err);
  }
}
