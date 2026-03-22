import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} from 'discord.js';

import { readDB, writeDB } from '../utils/database';

export default {
  name: 'interactionCreate',

  async execute(interaction) {
    try {

      // ================= BOTÕES =================
      if (interaction.isButton()) {

        // 🔗 ANTI LINK
        if (interaction.customId === 'config_antilink') {

          const embed = new EmbedBuilder()
            .setTitle('🔗 Anti-Link')
            .setDescription('Ative ou desative o anti-link neste canal.')
            .setColor('Blue');

          const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('select_antilink')
                .setPlaceholder('Escolha uma opção')
                .addOptions([
                  { label: 'Ativar', value: 'on' },
                  { label: 'Desativar', value: 'off' }
                ])
            );

          return interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
          });
        }

        // 📜 LOGS
        if (interaction.customId === 'config_logs') {

          const embed = new EmbedBuilder()
            .setTitle('📜 Sistema de Logs')
            .setDescription('Configure o canal de logs.')
            .setColor('Green');

          const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('select_logs')
                .setPlaceholder('Escolha uma opção')
                .addOptions([
                  { label: 'Definir canal atual', value: 'set' },
                  { label: 'Remover canal', value: 'remove' }
                ])
            );

          return interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
          });
        }

        // 🚫 ANTI SPAM
        if (interaction.customId === 'config_antispam') {
          return interaction.reply({
            content: '🚧 Anti-Spam em desenvolvimento...',
            ephemeral: true
          });
        }
      }

      // ================= SELECT =================
      if (interaction.isStringSelectMenu()) {

        const db = readDB();
        const guildId = interaction.guild.id;
        const channelId = interaction.channel.id;

        // 🔗 ANTI LINK
        if (interaction.customId === 'select_antilink') {

          if (!db.antiLink[guildId]) db.antiLink[guildId] = [];

          if (interaction.values[0] === 'on') {
            if (!db.antiLink[guildId].includes(channelId)) {
              db.antiLink[guildId].push(channelId);
            }
          } else {
            db.antiLink[guildId] =
              db.antiLink[guildId].filter(id => id !== channelId);
          }

          writeDB(db);

          // 🔥 resolve loading infinito
          await interaction.deferUpdate();

          return interaction.followUp({
            content: '✅ Anti-Link atualizado com sucesso.',
            ephemeral: true
          });
        }

        // 📜 LOGS
        if (interaction.customId === 'select_logs') {

          if (!db.logs) db.logs = {};

          if (interaction.values[0] === 'set') {
            db.logs[guildId] = channelId;
          } else {
            delete db.logs[guildId];
          }

          writeDB(db);

          // 🔥 resolve loading infinito
          await interaction.deferUpdate();

          return interaction.followUp({
            content: '✅ Sistema de logs atualizado.',
            ephemeral: true
          });
        }
      }

    } catch (err) {
      console.error('Erro no configPanel:', err);

      if (!interaction.replied) {
        try {
          await interaction.reply({
            content: '❌ Ocorreu um erro.',
            ephemeral: true
          });
        } catch {}
      }
    }
  }
};
