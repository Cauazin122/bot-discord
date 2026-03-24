import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} from "discord.js";

import GuildConfig from "../models/GuildConfig.js";

export default {
  async execute(interaction) {
    try {

      const guildId = interaction.guild.id;

      let guild = await GuildConfig.findOne({ guildId });
      if (!guild) guild = await GuildConfig.create({ guildId });

      // 🔘 BOTÕES
      if (interaction.isButton()) {

        if (interaction.customId === "config_antilink") {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("🔗 Anti-Link")
                .setDescription("Ativar ou desativar")
                .setColor("Blue")
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("select_antilink")
                  .addOptions([
                    { label: "Ativar", value: "on" },
                    { label: "Desativar", value: "off" }
                  ])
              )
            ],
            ephemeral: true
          });
        }

        if (interaction.customId === "config_logs") {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("📜 Logs")
                .setDescription("Configurar canal")
                .setColor("Green")
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("select_logs")
                  .addOptions([
                    { label: "Definir canal", value: "set" },
                    { label: "Remover", value: "remove" }
                  ])
              )
            ],
            ephemeral: true
          });
        }

        if (interaction.customId === "config_antispam") {
          guild.antiSpam.enabled = !guild.antiSpam.enabled;
          await guild.save();

          return interaction.reply({
            content: `✅ AntiSpam: ${guild.antiSpam.enabled ? "ON" : "OFF"}`,
            ephemeral: true
          });
        }
      }

      // 🔽 SELECT
      if (interaction.isStringSelectMenu()) {

        const channelId = interaction.channel.id;

        if (interaction.customId === "select_antilink") {

          if (interaction.values[0] === "on") {
            if (!guild.antiLink.includes(channelId)) {
              guild.antiLink.push(channelId);
            }
          } else {
            guild.antiLink = guild.antiLink.filter(id => id !== channelId);
          }

          await guild.save();
          await interaction.deferUpdate();

          return interaction.followUp({
            content: "✅ Anti-Link atualizado",
            ephemeral: true
          });
        }

        if (interaction.customId === "select_logs") {

          if (interaction.values[0] === "set") {
            guild.logs = channelId;
          } else {
            guild.logs = null;
          }

          await guild.save();
          await interaction.deferUpdate();

          return interaction.followUp({
            content: "✅ Logs atualizado",
            ephemeral: true
          });
        }
      }

    } catch (err) {
      console.error(err);
    }
  }
};
