import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} from 'discord.js';
import Guild from '../models/Guild.js';

export async function handleCalculatorButton(interaction: ButtonInteraction) {
  if (interaction.customId !== 'calc_robux_to_real') return;

  const modal = new ModalBuilder()
    .setCustomId('modal_robux_price')
    .setTitle('Preço de Robux e Gamepass');

  const robuxInput = new TextInputBuilder()
    .setCustomId('robux_value')
    .setLabel('Coloque os Robux que deseja')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ex: 50')
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(robuxInput));

  await interaction.showModal(modal);
}

export async function handleCalculatorModal(interaction) {
  if (interaction.customId !== 'modal_robux_price') return;

  const robuxValue = parseFloat(interaction.fields.getTextInputValue('robux_value'));

  if (isNaN(robuxValue) || robuxValue <= 0) {
    return interaction.reply({
      content: '❌ Valor inválido! Digite um número maior que 0.',
      ephemeral: true
    });
  }

  const guildId = interaction.guild.id;
  const guild = await Guild.findOne({ guildId });

  const taxa = guild?.taxaRobux || 0.05;
  const margem = guild?.margemVenda || 1.30;

  const precoReal = (robuxValue * taxa * margem).toFixed(2);
  const precoGamepass = (robuxValue * taxa).toFixed(2);

  const embed = new EmbedBuilder()
    .setTitle('💰 Preço Calculado')
    .addFields(
      { name: '🎮 Robux Taxado', value: `R${precoReal}`, inline: true },
      { name: '🎮 Robux sem taxa', value: `R${precoGamepass}`, inline: true },
      { name: '💳 Gamepass', value: `R$ ${precoGamepass}`, inline: true }
    )
    .setColor('Green')
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
