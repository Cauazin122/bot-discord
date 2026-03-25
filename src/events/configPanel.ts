import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonInteraction, StringSelectMenuInteraction } from 'discord.js';
import Guild from '../models/Guild.js';

export async function handleConfigPanel(interaction: ButtonInteraction | StringSelectMenuInteraction) {
  const guildId = interaction.guild.id;
  let guild = await Guild.findOne({ guildId });

  if (!guild) {
    guild = await Guild.create({ guildId });
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'config_logs') {
      const embed = new EmbedBuilder()
        .setTitle('📜 Logs')
        .setDescription(`Status: ${guild.logChannel ? '🟢 Configurado' : '🔴 Não configurado'}`)
        .setColor('Green');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_logs')
            .addOptions(
              { label: 'Definir canal atual', value: 'set' },
              { label: 'Remover', value: 'remove' }
            )
        );

      return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    if (interaction.customId === 'config_antilink') {
      const embed = new EmbedBuilder()
        .setTitle('🔗 Anti-Link')
        .setDescription(`Status: ${guild.antiLinkEnabled ? '🟢 Ativo' : '🔴 Desativado'}`)
        .setColor('Blue');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_antilink')
            .addOptions(
              { label: 'Ativar', value: 'on' },
              { label: 'Desativar', value: 'off' }
            )
        );

      return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    if (interaction.customId === 'config_antispam') {
      const embed = new EmbedBuilder()
        .setTitle('🚫 Anti-Spam')
        .setDescription(`Status: ${guild.antiSpamEnabled ? '🟢 Ativo' : '🔴 Desativado'}`)
        .setColor('Red');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_antispam')
            .addOptions(
              { label: 'Ativar', value: 'on' },
              { label: 'Desativar', value: 'off' }
            )
        );

      return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    if (interaction.customId === 'config_automod') {
      const embed = new EmbedBuilder()
        .setTitle('⚙️ AutoMod')
        .setDescription(`Mute: ${guild.autoMod.muteAt}\nKick: ${guild.autoMod.kickAt}`)
        .setColor('Yellow');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_automod')
            .addOptions(
              { label: 'Mute: 3', value: 'mute_3' },
              { label: 'Mute: 5', value: 'mute_5' },
              { label: 'Kick: 5', value: 'kick_5' },
              { label: 'Kick: 7', value: 'kick_7' }
            )
        );

      return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
  }

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'select_logs') {
      if (interaction.values[0] === 'set') {
        guild.logChannel = interaction.channelId;
      } else {
        guild.logChannel = undefined;
      }
      await guild.save();
      return interaction.reply({ content: '✅ Logs atualizado!', ephemeral: true });
    }

    if (interaction.customId === 'select_antilink') {
      guild.antiLinkEnabled = interaction.values[0] === 'on';
      guild.antiLinkChannel = interaction.channelId;
      await guild.save();
      return interaction.reply({ content: '✅ Anti-Link atualizado!', ephemeral: true });
    }

    if (interaction.customId === 'select_antispam') {
      guild.antiSpamEnabled = interaction.values[0] === 'on';
      await guild.save();
      return interaction.reply({ content: '✅ Anti-Spam atualizado!', ephemeral: true });
    }

    if (interaction.customId === 'select_automod') {
      const value = interaction.values[0];
      if (value.startsWith('mute')) {
        guild.autoMod.muteAt = parseInt(value.split('_')[1]);
      }
      if (value.startsWith('kick')) {
        guild.autoMod.kickAt = parseInt(value.split('_')[1]);
      }
      await guild.save();
      return interaction.reply({ content: '✅ AutoMod atualizado!', ephemeral: true });
    }
  }
}
