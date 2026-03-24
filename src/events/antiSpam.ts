import GuildConfig from "../models/GuildConfig.js";

const userMessages = new Map();

export default {
  name: "messageCreate",

  async execute(message) {
    if (!message.guild || message.author.bot) return;

    const guild = await GuildConfig.findOne({ guildId: message.guild.id });
    if (!guild || !guild.antiSpam.enabled) return;

    const now = Date.now();
    const data = userMessages.get(message.author.id) || [];

    const filtered = data.filter(t => now - t < guild.antiSpam.interval);

    filtered.push(now);
    userMessages.set(message.author.id, filtered);

    if (filtered.length >= guild.antiSpam.maxMessages) {
      await message.delete().catch(() => {});
      await message.member.timeout(5000).catch(() => {});
    }
  }
};
