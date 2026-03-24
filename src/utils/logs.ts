import { EmbedBuilder } from "discord.js";
import GuildConfig from "../models/GuildConfig.js";

export async function sendLog(guild, data) {
  if (!guild) return;

  const config = await GuildConfig.findOne({ guildId: guild.id });
  if (!config || !config.logs) return;

  const channel = guild.channels.cache.get(config.logs);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#2b2d31")
    .setTitle(`📌 ${data.action}`)
    .addFields(
      { name: "👤 Usuário", value: `${data.user?.tag || "N/A"}` },
      { name: "🛠️ Staff", value: `${data.staff?.tag || "Sistema"}` },
      { name: "📄 Detalhes", value: data.reason || "Sem motivo" }
    )
    .setTimestamp();

  channel.send({ embeds: [embed] }).catch(() => {});
}
