import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export async function handleClaimTicket(interaction: ButtonInteraction) {
  const guildData = await Guild.findOne({ guildId: interaction.guild.id });

  if (!guildData?.staffRoles?.some(r => interaction.member.roles.cache.has(r))) {
    return interaction.reply({ content: '❌ Apenas staff pode assumir tickets.', ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setDescription(`📌 Ticket assumido por **${interaction.user.tag}**`)
    .setColor('Green')
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
