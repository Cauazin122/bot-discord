import { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import Guild from '../models/Guild.js';

export async function handleCloseTicket(interaction: ButtonInteraction) {
  if (interaction.customId !== 'close_ticket') return;

  const guild = await Guild.findOne({ guildId: interaction.guild.id });
  if (!guild?.staffRoles?.some(r => interaction.member.roles.cache.has(r))) {
    return interaction.reply({ content: '❌ Apenas staff pode fechar tickets.', ephemeral: true });
  }

  const ratingEmbed = new EmbedBuilder()
    .setTitle('⭐ Avaliar Atendimento')
    .setDescription('Clique em uma estrela para avaliar')
    .setColor('Gold');

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder().setCustomId('rate_1').setLabel('⭐').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('rate_2').setLabel('⭐⭐').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('rate_3').setLabel('⭐⭐⭐').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('rate_4').setLabel('⭐⭐⭐⭐').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('rate_5').setLabel('⭐⭐⭐⭐⭐').setStyle(ButtonStyle.Success)
    );

  const msg = await interaction.reply({ embeds: [ratingEmbed], components: [row], fetchReply: true });

  const collector = msg.createMessageComponentCollector({ time: 60000 });

  collector.on('collect', async (btn) => {
    const rating = parseInt(btn.customId.replace('rate_', ''));

    const modal = new ModalBuilder()
      .setCustomId(`feedback_${rating}`)
      .setTitle('Feedback Opcional');

    const input = new TextInputBuilder()
      .setCustomId('feedback')
      .setLabel('Feedback')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMaxLength(500);

    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));

    await btn.showModal(modal);

    try {
      const submit = await btn.awaitModalSubmit({ time: 300000 });
      const feedback = submit.fields.getTextInputValue('feedback');

      guild.ratings.push({
        userId: interaction.user.id,
        stars: rating,
        feedback,
        date: new Date()
      });

      await guild.save();
      await submit.reply({ content: '✅ Avaliação salva!', ephemeral: true });

      collector.stop();
    } catch {}
  });

  collector.on('end', async () => {
    try {
      await interaction.channel.send(`📝 Ticket fechado por ${interaction.user.tag}`);
      setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
    } catch {}
  });
}
