import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Ver comandos disponíveis para membros'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📋 Comandos Disponíveis')
      .setDescription('Aqui estão todos os comandos que você pode usar:')
      .addFields(
        { name: '🎮 Diversão', value: '/8ball · /dice · /coinflip · /rps · /avatar', inline: false },
        { name: '🎫 Tickets', value: '/ticket', inline: false },
        { name: '📊 Ranking', value: '/top · /warns', inline: false },
        { name: '❓ Informações', value: '/ping · /help', inline: false }
      )
      .setColor('Blue')
      .setFooter({ text: 'Use /helpadm para ver comandos de administração' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
