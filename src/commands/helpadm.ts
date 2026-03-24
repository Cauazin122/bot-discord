import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("helpadm")
    .setDescription("Comandos de admin"),
  
async execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📋 Comandos Disponíveis")
    .setDescription("Aqui estão todos os comandos que você pode usar:")
    .addFields(
      { name: "/ban", value: "Comando usado para banir outros players", inline: true },
      { name: "/kick", value: "Comando usado para expulsar membros do servidor", inline: true },
      { name: "/mute", value: "Comando usado para silenciar um membro", inline: true },
      { name: "/warn", value: "Comando usado para dar um aviso em um membro", inline: true },
      { name: "/warns", value: "Comando usado para ver as warns de um membro",inline: true },
      { name: "/removewarn", value: "Comando usado para remover o aviso de um membro", inline: true},
      { name: "/config", value: "Comando usado para configurar o anti-link/spam/autoMod/logs", inline: true}
    )
    .setFooter({ text: `Solicitado por ${interaction.user.username}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
