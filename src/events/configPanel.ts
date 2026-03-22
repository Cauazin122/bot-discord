import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import { readDB, writeDB } from '../utils/database';

export default {
  name: 'interactionCreate',

  async execute(interaction) {
    if (!interaction.isButton()) return;

    const db = readDB();
    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

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
        content: 'Configurar Anti-Link:',
        components: [row],
        ephemeral: true
      });
    }

    // 📥 SELECT MENU
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'select_antilink') {
        const value = interaction.values[0];

        if (!db.antiLink[guildId]) {
          db.antiLink[guildId] = [];
        }

        if (value === 'on') {
          if (!db.antiLink[guildId].includes(channelId)) {
            db.antiLink[guildId].push(channelId);
          }

          await interaction.reply({
            content: '✅ Anti-Link ativado neste canal.',
            ephemeral: true
          });
        }

        if (value === 'off') {
          db.antiLink[guildId] = db.antiLink[guildId].filter(
            id => id !== channelId
          );

          await interaction.reply({
            content: '❌ Anti-Link desativado neste canal.',
            ephemeral: true
          });
        }

        writeDB(db);
      }
    }
  }
};
