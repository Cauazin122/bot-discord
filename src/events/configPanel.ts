import { Interaction, EmbedBuilder } from 'discord.js';
import { Command } from '../commands/index.js';

export async function handleInteraction(interaction: Interaction, commands: Record<string, Command>) {

  // ✅ SLASH COMMANDS (mantido)
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

  // 🔘 BOTÕES (mantido)
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
      return interaction.channel.delete();
    }
  }

  // 📜 DROPDOWN MENU (melhorado)
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'config_menu') {
      const value = interaction.values[0];

      let embed;

      if (value === 'logs') {
        embed = new EmbedBuilder()
          .setTitle('📜 Configuração de Logs')
          .setDescription('Defina o canal onde os logs serão enviados.')
          .setColor('Blue');
      }

      if (value === 'antilink') {
        embed = new EmbedBuilder()
          .setTitle('🔗 Anti-Link')
          .setDescription('Ative/desative o sistema de anti-link.')
          .setColor('Blue');
      }

      if (value === 'antispam') {
        embed = new EmbedBuilder()
          .setTitle('🚫 Anti-Spam')
          .setDescription('Configure o sistema de anti-spam.')
          .setColor('Blue');
      }

      if (value === 'tickets') {
        embed = new EmbedBuilder()
          .setTitle('🎫 Categoria de Tickets')
          .setDescription('Defina a categoria onde os tickets serão criados.')
          .setColor('Blue');
      }

      if (value === 'automod') {
        embed = new EmbedBuilder()
          .setTitle('⚙️ AutoMod')
          .setDescription('Configure punições automáticas.')
          .setColor('Blue');
      }

      // 🔥 IMPORTANTE: usa update ao invés de reply
      return interaction.update({
        embeds: [embed],
        components: interaction.message.components // mantém dropdown + botões
      });
    }
  }
}
