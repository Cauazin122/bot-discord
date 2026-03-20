import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Verifica a latência do bot");

export async function execute(interaction: ChatInputCommandInteraction) {
  const sent = await interaction.reply({ content: "Enviando ping...", fetchReply: true });
  const latency = sent.createdTimestamp - interaction.createdTimestamp;
  const apiLatency = Math.round(interaction.client.ws.ping);

  await interaction.editReply(
    `🏓 Pong!\n> **Latência de ida e volta:** ${latency}ms\n> **Latência da API:** ${apiLatency}ms`
  );
}
