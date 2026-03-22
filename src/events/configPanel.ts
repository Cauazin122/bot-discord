import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';

import { readDB, writeDB } from '../utils/database';

export default {
  name: 'interactionCreate',

  async execute(interaction) {

    // =========================
    // 🔘 BOTÕES
    // =========================
    if (interaction.isButton()) {

      // 🔗 ANTI LINK
      if (interaction.customId === 'config_antilink') {
        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('select_antilink')
              .setPlaceholder('Escolha uma opção')
              .addOptions([
                { label: 'Ativar neste canal', value: 'on' },
                { label: 'Desativar neste canal', value: 'off' },
              ])
          );

        return interaction.reply({
          content: '🔗 Configurar Anti-Link:',
          components: [row],
          ephemeral: true
        });
      }

      // 🚫 ANTI SPAM (placeholder)
      if (interaction.customId === 'config_antispam') {
        return interaction.reply({
          content: '⚠️ Configuração de Anti-Spam ainda não implementada.',
          ephemeral: true
        });
      }

      // 📜 LOGS
      if (interaction.customId === 'config_logs') {
        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('select_logs')
              .setPlaceholder('Escolha uma opção')
              .addOptions([
                { label: 'Definir este canal como logs', value: 'set' },
                { label: 'Remover canal de logs', value: 'remove' },
              ])
          );

        return interaction.reply({
          content: '📜 Configurar logs:',
          components: [row],
          ephemeral: true
        });
      }
    }

    // =========================
    // 📥 SELECT MENU
    // =========================
    if (interaction.isStringSelectMenu()) {

      const db = readDB();
      const guildId = interaction.guild.id;
      const channelId = interaction.channel.id;

      // 🔗 ANTI LINK
      if (interaction.customId === 'select_antilink') {

        if (!db.antiLink[guildId]) {
          db.antiLink[guildId] = [];
        }

        if (interaction.values[0] === 'on') {
          if (!db.antiLink[guildId].includes(channelId)) {
            db.antiLink[guildId].push(channelId);
          }

          writeDB(db);

          return interaction.reply({
            content: '✅ Anti-Link ativado neste canal.',
            ephemeral: true
          });
        }

        if (interaction.values[0] === 'off') {
          db.antiLink[guildId] = db.antiLink[guildId].filter(
            id => id !== channelId
          );

          writeDB(db);

          return interaction.reply({
            content: '❌ Anti-Link desativado neste canal.',
            ephemeral: true
          });
        }
      }

      // 📜 LOGS
      if (interaction.customId === 'select_logs') {

        if (interaction.values[0] === 'set') {
          db.logs[guildId] = channelId;

          writeDB(db);

          return interaction.reply({
            content: '✅ Canal de logs definido.',
            ephemeral: true
          });
        }

        if (interaction.values[0] === 'remove') {
          delete db.logs[guildId];

          writeDB(db);

          return interaction.reply({
            content: '❌ Canal de logs removido.',
            ephemeral: true
          });
        }
      }
    }
  }
};
