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

      // ================= BOTÕES =================
      if (interaction.isButton()) {

        // ⚙️ AUTOMOD
        if (interaction.customId === 'config_automod') {

          const db = readDB();
          const guildId = interaction.guild.id;

          if (!db.autoMod) db.autoMod = {};

          const config = db.autoMod[guildId] || {
            mute: 3,
            kick: 5
          };

          const embed = new EmbedBuilder()
            .setTitle('⚙️ AutoMod')
            .setDescription(
              `Configure as punições automáticas:\n\n🔇 Mute: ${config.mute} warns\n👢 Kick: ${config.kick} warns`
            )
            .setColor('Green');

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

        const db = readDB();
        const guildId = interaction.guild.id;

        if (!db.autoMod) db.autoMod = {};
        if (!db.autoMod[guildId]) {
          db.autoMod[guildId] = { mute: 3, kick: 5 };
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
            content: `✅ AutoMod atualizado!\n🔇 Mute: ${db.autoMod[guildId].mute}\n👢 Kick: ${db.autoMod[guildId].kick}`,
            ephemeral: true
          });
        }
      }

    } catch (err) {
      console.error('Erro no configPanel:', err);

      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Ocorreu um erro.',
          ephemeral: true
        });
      }
    }
  }
};
