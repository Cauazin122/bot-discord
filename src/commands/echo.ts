import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("eco")
  .setDescription("Repete uma mensagem para você")
  .addStringOption((option) =>
    option
      .setName("mensagem")
      .setDescription("A mensagem a ecoar")
      .setRequired(true)
      .setMaxLength(1000)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const message = interaction.options.getString("mensagem", true);
  await interaction.reply({ content: message });
}
