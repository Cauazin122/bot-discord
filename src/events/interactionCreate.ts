import { Interaction } from 'discord.js';
import { Command } from '../commands/index.js';

export async function handleInteraction(interaction: Interaction, commands: Record<string, Command>) {
  if (!interaction.isChatInputCommand()) return;

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
