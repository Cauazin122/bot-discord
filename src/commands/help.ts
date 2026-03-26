import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Ver comandos disponíveis'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📋 Comandos Disponíveis')
      .setDescription('Aqui estão todos os comandos que você pode usar:')
      .addFields(
        { name: '/ping', value: 'Verifica a latência do bot', inline: true },
        { name: '/top', value: 'Top 10 membros com melhor avaliação', inline: true },
        { name: '/warns', value: 'Ver warns de um usuário', inline: true }
      )
      .setColor('Blue')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
