import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";

export default {
  data: new SlashCommandBuilder()
    .setName("antilink")
    .setDescription("Ativar/desativar anti-link no canal")
    .addStringOption(option =>
      option
        .setName("status")
        .setDescription("on/off")
        .setRequired(true)
        .addChoices(
          { name: "Ativar", value: "on" },
          { name: "Desativar", value: "off" }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const status = interaction.options.getString("status");
    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    let guild = await GuildConfig.findOne({ guildId });
    if (!guild) guild = await GuildConfig.create({ guildId });

    if (status === "on") {
      if (!guild.antiLink.includes(channelId)) {
        guild.antiLink.push(channelId);
      }
    } else {
      guild.antiLink = guild.antiLink.filter(id => id !== channelId);
    }

    await guild.save();

    await interaction.reply({
      content: `🔗 Anti-Link ${status === "on" ? "ativado" : "desativado"} neste canal.`,
      ephemeral: true
    });
  }
};
