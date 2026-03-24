import { EmbedBuilder } from "discord.js";
import GuildConfig from "../models/GuildConfig.js";

export async function sendLog(guild, data) {
  const config = await GuildConfig.findOne({ guildId: guild.id });
  if (!config || !config.logs) return;

  const channel = guild.channels.cache.get(config.logs);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(`📌 ${data.action}`)
    .addFields(
      { name: "👤 Usuário", value: data.user.tag },
      { name: "🛠️ Staff", value: data.staff.tag },
      { name: "📄 Motivo", value: data.reason || "Sem motivo" }
    )
    .setTimestamp();

  channel.send({ embeds: [embed] });
}
