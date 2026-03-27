import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Jogue um dado')
    .addIntegerOption(o =>
      o.setName('lados').setDescription('Número de lados (padrão: 6)').setMinValue(2).setMaxValue(100)
    ),

  async execute(interaction) {
    const sides = interaction.options.getInteger('lados') || 6;
    const result = Math.floor(Math.random() * sides) + 1;

    const embed = new EmbedBuilder()
      .setTitle('🎲 Dado')
      .setDescription(`Você rolou um **${result}** em um dado de **${sides}** lados!`)
      .setColor('Blue')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
