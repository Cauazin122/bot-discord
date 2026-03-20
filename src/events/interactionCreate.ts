import { Interaction } from "discord.js";
import { Command } from "../commands/index.js";

export async function handleInteraction(
  interaction: Interaction,
  commands: Record<string, Command>
) {
  if (!interaction.isChatInputCommand()) return;

  const command = commands[interaction.commandName];

  if (!command) {
    console.error(`Comando não encontrado: ${interaction.commandName}`);
    await interaction.reply({
      content: "Comando desconhecido.",
      ephemeral: true,
    });
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Erro ao executar ${interaction.commandName}:`, error);
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Ocorreu um erro ao executar este comando.",
          flags: 64,
        });
      } else {
        await interaction.reply({
          content: "Ocorreu um erro ao executar este comando.",
          flags: 64,
        });
      }
    } catch (replyError) {
      console.error("Erro ao responder interação:", replyError);
    }
  }
}
