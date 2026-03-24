import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";

export default {
  async execute(interaction) {
    const guildId = interaction.guild.id;

    let guild = await GuildConfig.findOne({ guildId });
    if (!guild) guild = await GuildConfig.create({ guildId });

    // BOTÕES
    if (interaction.isButton()) {

      if (interaction.customId === "config_antispam") {
        guild.antiSpam.enabled = !guild.antiSpam.enabled;
        await guild.save();

        return interaction.reply({
          content: `✅ AntiSpam: ${guild.antiSpam.enabled ? "ON" : "OFF"}`,
          ephemeral: true
        });
      }
    }

    // SELECT
    if (interaction.isStringSelectMenu()) {

      await interaction.deferUpdate(); // 🔥 resolve "interaction failed"

      if (interaction.customId === "select_antilink") {

        const channelId = interaction.channel.id;

        if (interaction.values[0] === "on") {
          if (!guild.antiLink.includes(channelId)) {
            guild.antiLink.push(channelId);
          }
        } else {
          guild.antiLink = guild.antiLink.filter(id => id !== channelId);
        }

        await guild.save();

        return interaction.followUp({
          content: "✅ Anti-Link atualizado",
          ephemeral: true
        });
      }

      if (interaction.customId === "select_logs") {

        if (interaction.values[0] === "set") {
          guild.logs = interaction.channel.id;
        } else {
          guild.logs = null;
        }

        await guild.save();

        return interaction.followUp({
          content: "✅ Logs atualizado",
          ephemeral: true
        });
      }
    }
  }
};
