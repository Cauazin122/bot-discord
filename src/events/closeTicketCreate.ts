import fs from "fs";
import path from "path";
import {
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { getGuildConfig } from "../config.js";

export async function handleCloseTicketInteraction(
  interaction: ButtonInteraction
) {
  if (interaction.customId !== "close_ticket") return;

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
      content: "Apenas staffs podem fechar tickets.",
      flags: 64,
    });
    return;
  }

  const guild = interaction.guild;
  const guildConfig = getGuildConfig(guild?.id || "");

  if (!guild || !guildConfig.LOG_CHANNEL) {
    await interaction.reply({
      content: "Canal de log não configurado.",
      flags: 64,
    });
    return;
  }

  try {
    const ratingEmbed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("⭐ Avaliar Atendimento")
      .setDescription("Clique em uma estrela para avaliar o staff que te atendeu")
      .addFields({
        name: "Como é a avaliação?",
        value: "⭐ = Péssimo | ⭐⭐ = Ruim | ⭐⭐⭐ = Ok | ⭐⭐⭐⭐ = Bom | ⭐⭐⭐⭐⭐ = Excelente",
        inline: false,
      })
      .setTimestamp();

    const ratingRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("rate_1").setLabel("⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("rate_2").setLabel("⭐⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("rate_3").setLabel("⭐⭐⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("rate_4").setLabel("⭐⭐⭐⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("rate_5").setLabel("⭐⭐⭐⭐⭐").setStyle(ButtonStyle.Success)
    );

    const ratingMessage = await interaction.reply({
      embeds: [ratingEmbed],
      components: [ratingRow],
      fetchReply: true,
    });

    const filter = (btn: any) => ["rate_1", "rate_2", "rate_3", "rate_4", "rate_5"].includes(btn.customId);
    const collector = ratingMessage.createMessageComponentCollector({ filter, time: 60000 });

    let userRating = "Sem avaliação";
    let userFeedback = "";

    collector.on("collect", async (ratingInteraction) => {
      const rating = ratingInteraction.customId.replace("rate_", "");

      const modal = new ModalBuilder()
        .setCustomId(`feedback_modal_${rating}`)
        .setTitle("Feedback Opcional");

      const feedbackInput = new TextInputBuilder()
        .setCustomId("feedback_text")
        .setLabel("Feedback (opcional)")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
        .setMaxLength(500)
        .setPlaceholder("Deixe seu feedback sobre o atendimento...");

      const feedbackRow = new ActionRowBuilder<TextInputBuilder>().addComponents(feedbackInput);
      modal.addComponents(feedbackRow);

      await ratingInteraction.showModal(modal);

      try {
        const modalSubmit = await ratingInteraction.awaitModalSubmit({ time: 300000 });
        const feedback = modalSubmit.fields.getTextInputValue("feedback_text") || "";

        try {
          const dbPath = path.join(process.cwd(), "database.json");
          const dbData = fs.readFileSync(dbPath, "utf-8");
          const db = JSON.parse(dbData);

          db.avaliacoes.push({
            user: interaction.user.tag,
            estrelas: rating,
            feedback: feedback,
            data: new Date().toISOString(),
          });

          fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

          userRating = `${rating}⭐`;
          userFeedback = feedback;

          await modalSubmit.reply({
            content: "✅ Avaliação e feedback salvos com sucesso!",
            flags: 64,
          });

          collector.stop();
        } catch (error) {
          console.error("Erro ao salvar avaliação:", error);
          await modalSubmit.reply({
            content: "Erro ao salvar avaliação.",
            flags: 64,
          });
        }
      } catch (modalError) {
        try {
          await ratingInteraction.followUp({
            content: "⏰ Tempo esgotado para enviar feedback. Avaliação não foi registrada.",
            flags: 64,
          });
        } catch (e) {
          console.error("Erro ao informar timeout:", e);
        }
      }
    });

    collector.on("end", async () => {
      try {
        const logChannel = guild.channels.cache.get(guildConfig.LOG_CHANNEL);

        if (logChannel && logChannel.isTextBased()) {
          const embedLog = new EmbedBuilder()
            .setColor("#95a5a6")
            .setTitle("📝 Ticket Fechado")
            .addFields(
              { name: "👤 Usuário", value: `${interaction.user.tag}` },
              { name: "⭐ Avaliação", value: userRating },
              { name: "💬 Feedback", value: userFeedback || "Sem feedback" }
            )
            .setTimestamp();

          await logChannel.send({ embeds: [embedLog] });
        }

        await interaction.channel?.send(`$$transcript <#${guildConfig.TRANSCRIPT_CHANNEL}>`);

        setTimeout(() => {
          interaction.channel?.delete().catch((err) => console.error("Erro ao deletar canal:", err));
        }, 3000);
      } catch (error) {
        console.error("Erro ao finalizar ticket:", error);
      }
    });
  } catch (error) {
    console.error("Erro ao fechar ticket:", error);
    await interaction.reply({
      content: "Erro ao fechar o ticket.",
      flags: 64,
    });
  }
}
