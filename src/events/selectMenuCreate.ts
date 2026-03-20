import {
  StringSelectMenuInteraction,
  ChannelType,
  PermissionsBitField,
  OverwriteType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { getGuildConfig, TICKET_TYPES } from "../config.js";

export async function handleSelectMenuInteraction(
  interaction: StringSelectMenuInteraction
) {
  if (interaction.customId !== "select_ticket") return;

  const ticketType = interaction.values[0];
  const guild = interaction.guild;
  const guildConfig = getGuildConfig(guild?.id || "");

  if (!guild || !guildConfig.CATEGORY_ID || guildConfig.STAFF_ROLES.length === 0) {
    await interaction.reply({
      content: "Configuração do bot incompleta. Contate um administrador.",
      flags: 64,
    });
    return;
  }

  try {
    const staffRoleOverwrites = guildConfig.STAFF_ROLES.map((roleId) => ({
      id: roleId,
      allow: [PermissionsBitField.Flags.ViewChannel],
    }));

    const ticketChannel = await guild.channels.create({
      name: `ticket-${ticketType}-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: guildConfig.CATEGORY_ID,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        ...staffRoleOverwrites,
        {
          id: "557628352828014614",
          type: OverwriteType.Member,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.EmbedLinks,
            PermissionsBitField.Flags.ManageMessages,
            PermissionsBitField.Flags.ManageChannels,
          ],
        },
      ],
    });

    const claimButton = new ButtonBuilder()
      .setCustomId("claim_ticket")
      .setLabel("👤 Atender")
      .setStyle(ButtonStyle.Primary);

    const closeButton = new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("🔒 Fechar")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      claimButton,
      closeButton
    );

    const typeInfo = TICKET_TYPES[ticketType as keyof typeof TICKET_TYPES];
    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setTitle("🎫 Ticket Aberto")
      .setDescription(
        `Categoria: **${typeInfo?.label || ticketType}**\n\nExplique seu problema.`
      )
      .setTimestamp();

    const staffMentions = guildConfig.STAFF_ROLES.map((id) => `<@&${id}>`).join(" ");
    await ticketChannel.send({
      content: staffMentions,
      embeds: [embed],
      components: [row],
    });

    await interaction.reply({
      content: `Ticket criado: ${ticketChannel}`,
      flags: 64,
    });
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    await interaction.reply({
      content: "Falha ao criar ticket. Tente novamente mais tarde.",
      flags: 64,
    });
  }
}
