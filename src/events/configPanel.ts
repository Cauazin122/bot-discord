import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} from 'discord.js';

import { readDB, writeDB } from '../utils/database.js';

export default {
  name: 'interactionCreate',

  async execute(interaction) {
    try {

      const db = readDB();
      const guildId = interaction.guild.id;
      const channelId = interaction.channel.id;

      // 🔥 GARANTE ESTRUTURA
      if (!db.antiLink) db.antiLink = {};
      if (!db.logs) db.logs = {};
      if (!db.autoMod) db.autoMod = {};
      if (!db.antispam) db.antispam = {};

      if (!db.autoMod[guildId]) {
        db.autoMod[guildId] = { mute: 3, kick: 5 };
      }

      // ================= BOTÕES =================
      if (interaction.isButton()) {

        // 🔗 ANTI LINK
        if (interaction.customId === 'config_antilink') {

          const isActive =
            db.antiLink[guildId]?.includes(channelId);

          const embed = new EmbedBuilder()
            .setTitle('🔗 Anti-Link')
            .setDescription(
              `Status neste canal: **${isActive ? '🟢 ATIVO' : '🔴 DESATIVADO'}**`
            )
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

          const isActive = db.logs[guildId] === channelId;

          const embed = new EmbedBuilder()
            .setTitle('📜 Logs')
            .setDescription(
              `Status neste canal: **${isActive ? '🟢 ATIVO' : '🔴 DESATIVADO'}**`
            )
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

          const isActive = db.antispam[guildId] === true;

          const embed = new EmbedBuilder()
            .setTitle('🚫 Anti-Spam')
            .setDescription(
              `Status: **${isActive ? '🟢 ATIVO' : '🔴 DESATIVADO'}**`
            )
            .setColor('Red');

          const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('select_antispam')
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

        // ⚙️ AUTOMOD
        if (interaction.customId === 'config_automod') {

          const config = db.autoMod[guildId];

          const embed = new EmbedBuilder()
            .setTitle('⚙️ AutoMod')
            .setDescription(
              `🔇 Mute: ${config.mute} warns\n👢 Kick: ${config.kick} warns`
            )
            .setColor('Yellow');

          const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('select_automod')
                .setPlaceholder('Escolha uma opção')
                .addOptions([
                  { label: 'Mute: 3 warns', value: 'mute_3' },
                  { label: 'Mute: 5 warns', value: 'mute_5' },
                  { label: 'Mute: 7 warns', value: 'mute_7' },
                  { label: 'Kick: 5 warns', value: 'kick_5' },
                  { label: 'Kick: 7 warns', value: 'kick_7' },
                  { label: 'Kick: 10 warns', value: 'kick_10' }
                ])
            );

          return interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
          });
        }
      }

      // ================= SELECT =================
      if (interaction.isStringSelectMenu()) {

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

          await interaction.deferUpdate();

          return interaction.followUp({
            content: '✅ Anti-Link atualizado!',
            ephemeral: true
          });
        }

        // 📜 LOGS
        if (interaction.customId === 'select_logs') {

          if (interaction.values[0] === 'set') {
            db.logs[guildId] = channelId;
          } else {
            delete db.logs[guildId];
          }

          writeDB(db);

          await interaction.deferUpdate();

          return interaction.followUp({
            content: '✅ Logs atualizado!',
            ephemeral: true
          });
        }

        // 🚫 ANTI SPAM
        if (interaction.customId === 'select_antispam') {

          db.antispam[guildId] = interaction.values[0] === 'on';

          writeDB(db);

          await interaction.deferUpdate();

          return interaction.followUp({
            content: `✅ Anti-Spam ${db.antispam[guildId] ? 'ativado' : 'desativado'}!`,
            ephemeral: true
          });
        }

        // ⚙️ AUTOMOD
        if (interaction.customId === 'select_automod') {

          const value = interaction.values[0];

          if (value.startsWith('mute')) {
            db.autoMod[guildId].mute = parseInt(value.split('_')[1]);
          }

          if (value.startsWith('kick')) {
            db.autoMod[guildId].kick = parseInt(value.split('_')[1]);
          }

          writeDB(db);

          await interaction.deferUpdate();

          return interaction.followUp({
            content: '✅ AutoMod atualizado!',
            ephemeral: true
          });
        }
      }

    } catch (err) {
      console.error('Erro no configPanel:', err);

      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Erro no painel.',
          ephemeral: true
        });
      }
    }
  }
};
