import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ajuda")
  .setDescription("Lista todos os comandos disponíveis");

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📋 Comandos Disponíveis")
    .setDescription("Aqui estão todos os comandos que você pode usar:")
    .addFields(
      { name: "/ping", value: "Verifica a latência do bot", inline: true },
      { name: "/ajuda", value: "Mostra esta mensagem de ajuda", inline: true },
      { name: "/eco", value: "Repete uma mensagem para você", inline: true },
      { name: "/info", value: "Mostra informações sobre o servidor", inline: true }
    )
    .setFooter({ text: `Solicitado por ${interaction.user.username}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
