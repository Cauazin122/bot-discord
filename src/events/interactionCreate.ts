import { Command } from "../commands/index.js";
import { Interaction } from "discord.js";

export async function handleInteraction(interaction, commands) {
  if (!interaction.isChatInputCommand()) return;

  const command = commands[interaction.commandName];
  if (!command) return;

  try {
    // 🔥 ESSENCIAL
    await interaction.deferReply();

    await command.execute(interaction);

  } catch (err) {
    console.error(`Erro no comando ${interaction.commandName}:`, err);

    if (!interaction.replied) {
      await interaction.editReply("❌ Erro ao executar comando.");
    }
  }
}
