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

        if (interaction.customId === 'config_antispam') {
          return interaction.reply({
            content: '🚧 Anti-Spam em desenvolvimento...',
            ephemeral: true
          });
        }
      }

      // ================= SELECT =================
      if (interaction.isStringSelectMenu()) {

        // 🔥 RESPONDE IMEDIATO (ANTI ERRO)
        await interaction.deferReply({ ephemeral: true });

        const db = readDB();
        const guildId = interaction.guild.id;
        const channelId = interaction.channel.id;

        // 🔗 ANTI LINK
        if (interaction.customId ===
