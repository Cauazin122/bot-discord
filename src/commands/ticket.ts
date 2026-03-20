import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} from "discord.js";
import { TICKET_TYPES } from "../config.js";

export const data = new SlashCommandBuilder()
  .setName("ticket")
  .setDescription("Envia o painel para criar um ticket de suporte neste canal")
  .setDefaultMemberPermissions(1);

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const embed = new EmbedBuilder()
      .setColor("#00b0f4")
      .setTitle("🎫 Central de Suporte")
      .setDescription("Escolha uma categoria abaixo para abrir seu ticket.")
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId("select_ticket")
      .setPlaceholder("Escolha uma opção")
      .addOptions(
        Object.entries(TICKET_TYPES).map(([value, { label, emoji }]) => ({
          label,
          value,
          emoji,
        }))
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      menu
    );

    await interaction.deferReply({ ephemeral: true });

    const message = await interaction.channel?.send({
      embeds: [embed],
      components: [row],
    });

    if (message) {
      await interaction.editReply({
        content: "Painel de suporte enviado para o canal.",
      });
    } else {
      await interaction.editReply({
        content: "Erro ao enviar painel. Tente novamente.",
      });
    }
  } catch (error) {
    console.error("Erro ao executar /ticket:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "Erro ao enviar painel.",
        flags: 64,
      });
    } else if (interaction.deferred) {
      await interaction.editReply("Erro ao enviar painel.");
    }
  }
}
