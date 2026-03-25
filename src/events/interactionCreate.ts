import { Interaction } from 'discord.js';
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

  // 🔘 BOTÕES (novo)
  if (interaction.isButton()) {
    if (interaction.customId === 'config_logs') {
      return interaction.reply({ content: 'Configurar logs...', ephemeral: true });
    }

    if (interaction.customId === 'config_antilink') {
      return interaction.reply({ content: 'Configurar anti-link...', ephemeral: true });
    }

    if (interaction.customId === 'config_antispam') {
      return interaction.reply({ content: 'Configurar anti-spam...', ephemeral: true });
    }

    if (interaction.customId === 'config_automod') {
      return interaction.reply({ content: 'Configurar AutoMod...', ephemeral: true });
    }

    if (interaction.customId === 'close_ticket') {
      return interaction.channel.delete();
    }
  }

  // 📜 DROPDOWN MENU (novo)
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'config_menu') {
      const value = interaction.values[0];

      if (value === 'logs') {
        return interaction.reply({ content: '📜 Configuração de logs...', ephemeral: true });
      }

      if (value === 'antilink') {
        return interaction.reply({ content: '🔗 Configuração de anti-link...', ephemeral: true });
      }

      if (value === 'antispam') {
        return interaction.reply({ content: '🚫 Configuração de anti-spam...', ephemeral: true });
      }

      if (value === 'tickets') {
        return interaction.reply({ content: '🎫 Configuração de categoria de tickets...', ephemeral: true });
      }

      if (value === 'automod') {
        return interaction.reply({ content: '⚙️ Configuração de AutoMod...', ephemeral: true });
      }
    }
  }
}
