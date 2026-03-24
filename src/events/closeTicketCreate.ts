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
import GuildConfig from "../models/GuildConfig.js";

export async function handleCloseTicketInteraction(
  interaction: ButtonInteraction
) {
  if (interaction.customId !== "close_ticket") return;

  const guild = interaction.guild;
  const guildConfig = getGuildConfig(guild?.id || "");

  if (!guild) return;

  try {
    const ratingEmbed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("⭐ Avaliar Atendimento")
      .setDescription("Clique para avaliar")
      .setTimestamp();

    const ratingRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("rate_1").setLabel("⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("rate_2").setLabel("⭐⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("rate_3").setLabel("⭐⭐⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("rate_4").setLabel("⭐⭐⭐⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("rate_5").setLabel("⭐⭐⭐⭐⭐").setStyle(ButtonStyle.Success)
    );

    const msg = await interaction.reply({
      embeds: [ratingEmbed],
      components: [ratingRow],
      fetchReply: true,
    });

    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on("collect", async (btn) => {
      const rating = btn.customId.replace("rate_", "");

      const modal = new ModalBuilder()
        .setCustomId(`feedback_${rating}`)
        .setTitle("Feedback");

      const input = new TextInputBuilder()
        .setCustomId("feedback")
        .setLabel("Feedback")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));

      await btn.showModal(modal);

      const submit = await btn.awaitModalSubmit({ time: 300000 });

      const feedback = submit.fields.getTextInputValue("feedback") || "";

      // 🔥 SALVAR NO MONGO
      let guildDB = await GuildConfig.findOne({ guildId: guild.id });
      if (!guildDB) guildDB = await GuildConfig.create({ guildId: guild.id });

      guildDB.avaliacoes.push({
        user: interaction.user.tag,
        estrelas: rating,
        feedback
      });

      await guildDB.save();

      await submit.reply({
        content: "✅ Avaliação salva!",
        ephemeral: true
      });

      collector.stop();
    });

    collector.on("end", async () => {
      await interaction.channel?.delete().catch(() => {});
    });

  } catch (err) {
    console.error(err);
  }
}
