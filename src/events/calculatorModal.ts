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

export async function handleRealToRobuxButton(interaction: ButtonInteraction) {
  if (interaction.customId !== 'calc_real_to_robux') return;

  const modal = new ModalBuilder()
    .setCustomId('modal_real_price')
    .setTitle('Conversão Real → Robux');

  const realInput = new TextInputBuilder()
    .setCustomId('real_value')
    .setLabel('Coloque o valor em Reais que deseja')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ex: 50.00')
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(realInput));

  await interaction.showModal(modal);
}

export async function handleCalculatorModal(interaction) {
  if (interaction.customId !== 'modal_robux_price' && interaction.customId !== 'modal_real_price') return;

  const guildId = interaction.guild.id;
  const guild = await Guild.findOne({ guildId });

  const taxa = guild?.taxaRobux || 0.05;
  const margem = guild?.margemVenda || 1.30;

  if (interaction.customId === 'modal_robux_price') {
    const robuxValue = parseFloat(interaction.fields.getTextInputValue('robux_value'));

    if (isNaN(robuxValue) || robuxValue <= 0) {
      return interaction.reply({
        content: '❌ Valor inválido! Digite um número maior que 0.',
        ephemeral: true
      });
    }

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
          name: '🎮 Robux Taxado:', value: `R$ ${precoReal}\n📝 Crie uma gamepass no valor de: **${robuxGamepass} Rbx**`,
          inline: false
        },
        { name: '🎮 Robux sem taxa', value: `R$ ${precoGamepass} **(${robuxValue}rbx)**\n**__Receberá apenas ${robuxRecebido}rbx__**`, inline: false },
        { name: '💳 Gamepass', value: `R$ ${precoGamepass} **(${robuxValue}rbx)**`, inline: false }
      )
      .setColor('Green')
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (interaction.customId === 'modal_real_price') {
    const realValue = parseFloat(interaction.fields.getTextInputValue('real_value'));

    if (isNaN(realValue) || realValue <= 0) {
      return interaction.reply({
        content: '❌ Valor inválido! Digite um número maior que 0.',
        ephemeral: true
      });
    }

    // Robux equivalente ao valor em Reais sem margem
    const robuxSemMargem = Math.floor(realValue / taxa);

    // Robux que o vendedor precisa cobrar considerando a margem de lucro
    const robuxComMargem = Math.floor(realValue / (taxa * margem));

    // Robux que o usuário receberá após Roblox descontar 30%
    const robuxAposDesconto = Math.floor(robuxComMargem * 0.70);

    const percentualMargem = ((margem - 1) * 100).toFixed(0);

    const embed = new EmbedBuilder()
      .setTitle('💵 Conversão Real → Robux')
      .addFields(
        { name: '💰 Valor em Reais', value: `R$ ${realValue.toFixed(2)}`, inline: false },
        { name: '🎮 Robux Taxado', value: `**${robuxValue} Rbx**\n📝 Crie uma gamepass no valor de: **${robuxGamepass} Rbx**`, inline: false },
        { name: '✅ Robux Sem Taxa', value: `**${robuxValue} Rbx**`, inline: false }
      )
      .setColor('Gold')
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
