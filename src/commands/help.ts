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
        { name: '🔧 Geral', value: '/ping · /help · /helpadm', inline: false },
        { name: '⭐ Avaliações', value: '/avaliacoes · /top', inline: false },
        { name: '🎫 Tickets', value: '/ticket (admin)', inline: false },
        { name: '🎮 Diversão', value: '/8ball · /dice · /coinflip · /rps · /avatar', inline: false }
      )
      .setColor('Blue')
      .setFooter({ text: 'Use /helpadm para ver comandos de moderação' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
