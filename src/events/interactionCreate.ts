import { Interaction } from "discord.js";

export async function handleInteraction(interaction, commands) {
  if (!interaction.isChatInputCommand()) return;

  const command = commands[interaction.commandName];
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Erro no comando ${interaction.commandName}:`, err);

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "❌ Erro ao executar comando.",
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: "❌ Erro ao executar comando.",
          ephemeral: true
        });
      }
    } catch {}
  }
}
