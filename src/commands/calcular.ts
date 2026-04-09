import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  data: new SlashCommandBuilder()
    .setName('calcular')
    .setDescription('Calcular preço de Gamepass e Robux'),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const guild = await Guild.findOne({ guildId });

    const taxa = guild?.taxaRobux || 0.05;
    const margem = guild?.margemVenda || 1.30;
    const percentualMargem = ((margem - 1) * 100).toFixed(0);

    const embed = new EmbedBuilder()
      .setTitle('🎮 Calculadora de Preço')
      .setDescription('Seja bem vindo a nossa central de preços aqui você podera ver quantos reais custa a gamepass ou os robux (com e sem taxa) que deseja.')
      .addFields(
        { name: '💱 Taxa Atual', value: `1 Robux = R$ ${taxa.toFixed(2)}`, inline: true },
        { name: '❓ Como usar?', value: `Simples basta escrever quantos robux você quer receber ou quantos robux a gamepass que você deseja custa e te falamos o preço dela`, inline: false}
      )
      .setColor('Blue')
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('calc_robux_to_real')
          .setLabel('Calcular Robux → Real')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🧮')
      );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
