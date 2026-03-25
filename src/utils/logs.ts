import { EmbedBuilder, Guild as DiscordGuild } from 'discord.js';
import Guild from '../models/Guild.js';

export async function sendLog(guild: DiscordGuild, data: any) {
  try {
    const guildData = await Guild.findOne({ guildId: guild.id });
    if (!guildData?.logChannel) return;

    const channel = guild.channels.cache.get(guildData.logChannel);
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

    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error('Erro ao enviar log:', err);
  }
}
