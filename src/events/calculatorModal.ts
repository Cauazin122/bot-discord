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

  // Robux que o usuário recebe após Roblox tirar 30%
  const robuxRecebido = Math.floor(robuxValue * 0.70);

  // Robux necessário na gamepass para que o usuário receba o valor desejado
  // Se o usuário quer receber X, e Roblox tira 30%, precisa de X ÷ 0.70
  const robuxGamepass = Math.ceil(robuxValue / 0.70);

  const embed = new EmbedBuilder()
    .setTitle('💰 Preço Calculado')
    .addFields(
      {
        name: '🎮 Robux Taxado:', value: `R$ ${precoReal}\n📝 Crie uma gamepass no valor de: **${robuxGamepass} Rbx**\n(Após Roblox tirar 30%, você receberá ${robuxValue} Rbx)`,
        inline: false
      },
      { name: '🎮 Robux sem taxa', value: `R$ ${precoGamepass} (${robuxRecebido}rbx)`, inline: true },
      { name: '💳 Gamepass', value: `R$ ${precoGamepass} (${robuxValue}rbx)`, inline: true }
    )
    .setColor('Green')
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
