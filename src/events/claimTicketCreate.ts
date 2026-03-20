import {
  ButtonInteraction,
  EmbedBuilder,
} from "discord.js";
import { getGuildConfig } from "../config.js";

export async function handleClaimTicketInteraction(
  interaction: ButtonInteraction
) {
  if (interaction.customId !== "claim_ticket") return;

  const guildConfig = getGuildConfig(interaction.guild?.id || "");
  const staffRoles = guildConfig.STAFF_ROLES;

  if (!interaction.member || !("roles" in interaction.member)) {
    await interaction.reply({
      content: "Não foi possível verificar suas permissões.",
      flags: 64,
    });
    return;
  }

  const hasStaffRole = staffRoles.some((roleId) =>
    interaction.member!.roles.cache.has(roleId)
  );

  if (!hasStaffRole) {
    await interaction.reply({
      content: "Apenas staffs podem atender tickets.",
      flags: 64,
    });
    return;
  }

  try {
    const channelTopic = interaction.channel?.topic || "";
    if (channelTopic.includes("👤 Atendido por")) {
      await interaction.reply({
        content: "Este ticket já foi atendido por um staff.",
        flags: 64,
      });
      return;
    }

    const staffName = interaction.user.username;
    const newTopic = `👤 Atendido por ${staffName} | ${channelTopic}`;

    if (interaction.channel?.isTextBased()) {
      await interaction.channel.setTopic(newTopic.substring(0, 1024));
    }

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("✅ Ticket Atendido")
      .setDescription(`Staff **${staffName}** está atendendo este ticket.`)
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  } catch (error) {
    console.error("Erro ao atender ticket:", error);
    await interaction.reply({
      content: "Erro ao atender o ticket.",
      flags: 64,
    });
  }
}
