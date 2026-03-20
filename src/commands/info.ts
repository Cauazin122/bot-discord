import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Mostra informações sobre este servidor e o bot");

export async function execute(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild;

  if (!guild) {
    await interaction.reply({ content: "Este comando só pode ser usado em um servidor.", ephemeral: true });
    return;
  }

  await guild.fetch();

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`ℹ️ ${guild.name}`)
    .setThumbnail(guild.iconURL())
    .addFields(
      { name: "👑 Dono", value: `<@${guild.ownerId}>`, inline: true },
      { name: "👥 Membros", value: `${guild.memberCount}`, inline: true },
      { name: "📅 Criado em", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
      { name: "🤖 Latência do Bot", value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
      { name: "📡 Região", value: guild.preferredLocale, inline: true },
      { name: "🔒 Nível de Verificação", value: `${guild.verificationLevel}`, inline: true }
    )
    .setFooter({ text: `ID do Servidor: ${guild.id}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
