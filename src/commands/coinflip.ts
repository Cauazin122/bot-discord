import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Jogue uma moeda'),

  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Cara' : 'Coroa';

    const embed = new EmbedBuilder()
      .setTitle('🪙 Cara ou Coroa')
      .setDescription(`Resultado: **${result}**`)
      .setColor('Gold')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
