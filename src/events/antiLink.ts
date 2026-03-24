import GuildConfig from "../models/GuildConfig.js";

export default {
  name: "messageCreate",

  async execute(message) {
    if (!message.guild || message.author.bot) return;

    const guild = await GuildConfig.findOne({ guildId: message.guild.id });
    if (!guild) return;

    if (!guild.antiLink.includes(message.channel.id)) return;

    if (message.member.permissions.has("Administrator")) return;

    if (message.content.includes("http")) {
      await message.delete().catch(() => {});
    }
  }
};
