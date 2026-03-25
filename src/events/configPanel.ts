import {
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} from 'discord.js';
import { Command } from '../commands/index.js';
import Guild from '../models/Guild.js';

export async function handleInteraction(interaction: Interaction, commands: Record<string, Command>) {

  // ================================
  // ✅ SLASH COMMANDS
  // ================================
  if (interaction.isChatInputCommand()) {
    const command = commands[interaction.commandName];
    if (!command) {
      await interaction.reply({ content: '❌ Comando desconhecido.', ephemeral: true });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Erro ao executar ${interaction.commandName}:`, error);
      const reply = { content: '❌ Erro ao executar comando.', ephemeral: true };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  }

  // ================================
  // 🔘 BOTÕES
  // ================================
  if (interaction.isButton()) {

    if (interaction.customId === 'config_logs') {
      return interaction.reply({ content: '📜 Configurar logs...', ephemeral: true });
    }

    if (interaction.customId === 'config_antilink') {
      return interaction.reply({ content: '🔗 Configurar anti-link...', ephemeral: true });
    }

    if (interaction.customId === 'config_antispam') {
      return interaction.reply({ content: '🚫 Configurar anti-spam...', ephemeral: true });
    }

    if (interaction.customId === 'config_automod') {
      return interaction.reply({ content: '⚙️ Configurar AutoMod...', ephemeral: true });
    }

    if (interaction.customId === 'close_ticket') {
      return interaction.channel?.delete();
    }
  }

  // ================================
  // 📜 DROPDOWNS
  // ================================
  if (interaction.isStringSelectMenu()) {

    // ================================
    // 🎛️ MENU PRINCIPAL
    // ================================
    if (interaction.customId === 'config_menu') {
      const value = interaction.values[0];

      // 📜 LOGS
      if (value === 'logs') {
        const embed = new EmbedBuilder()
          .setTitle('📜 Configuração de Logs')
          .setDescription('Sistema de logs em breve...')
          .setColor('Blue');

        return interaction.update({
          embeds: [embed],
          components: interaction.message.components
        });
      }

      // 🔗 ANTILINK
      if (value === 'antilink') {
        const embed = new EmbedBuilder()
          .setTitle('🔗 Anti-Link')
          .setDescription('Sistema anti-link em breve...')
          .setColor('Blue');

        return interaction.update({
          embeds: [embed],
          components: interaction.message.components
        });
      }

      // 🚫 ANTISPAM
      if (value === 'antispam') {
        const embed = new EmbedBuilder()
          .setTitle('🚫 Anti-Spam')
          .setDescription('Sistema anti-spam em breve...')
          .setColor('Blue');

        return interaction.update({
          embeds: [embed],
          components: interaction.message.components
        });
      }

      // 🎫 TICKETS (🔥 PARTE IMPORTANTE)
      if (value === 'tickets') {

        const categories = interaction.guild.channels.cache
          .filter(c => c.type === 4)
          .map(c => ({
            label: c.name,
            value: c.id
          }))
          .slice(0, 25);

        if (categories.length === 0) {
          return interaction.reply({
            content: '❌ Nenhuma categoria encontrada.',
            ephemeral: true
          });
        }

        const embed = new EmbedBuilder()
          .setTitle('🎫 Selecionar Categoria')
          .setDescription('Escolha onde os tickets serão criados.')
          .setColor('Blue');

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('select_ticket_category')
              .setPlaceholder('Selecione uma categoria...')
              .addOptions(categories)
          );

        return interaction.update({
          embeds: [embed],
          components: [row]
        });
      }

      // ⚙️ AUTOMOD
      if (value === 'automod') {
        const embed = new EmbedBuilder()
          .setTitle('⚙️ AutoMod')
          .setDescription('Sistema de punições automáticas em breve...')
          .setColor('Blue');

        return interaction.update({
          embeds: [embed],
          components: interaction.message.components
        });
      }
    }

    // ================================
    // 🎫 SALVAR CATEGORIA DE TICKET
    // ================================
    if (interaction.customId === 'select_ticket_category') {

      const categoryId = interaction.values[0];

      let guildData = await Guild.findOne({ guildId: interaction.guild.id });

      if (!guildData) {
        guildData = await Guild.create({
          guildId: interaction.guild.id
        });
      }

      guildData.ticketCategory = categoryId;
      await guildData.save();

      return interaction.update({
        content: '✅ Categoria de tickets configurada com sucesso!',
        embeds: [],
        components: []
      });
    }
  }
}
