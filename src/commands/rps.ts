import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Jogue Pedra, Papel ou Tesoura')
    .addStringOption(o =>
      o.setName('escolha').setDescription('Sua escolha').setRequired(true)
        .addChoices(
          { name: 'Pedra', value: 'pedra' },
          { name: 'Papel', value: 'papel' },
          { name: 'Tesoura', value: 'tesoura' }
        )
    ),

  async execute(interaction) {
    const choices = ['pedra', 'papel', 'tesoura'];
    const userChoice = interaction.options.getString('escolha');
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = '';
    if (userChoice === botChoice) {
      result = 'Empate! 🤝';
    } else if (
      (userChoice === 'pedra' && botChoice === 'tesoura') ||
      (userChoice === 'papel' && botChoice === 'pedra') ||
      (userChoice === 'tesoura' && botChoice === 'papel')
    ) {
      result = 'Você venceu! 🎉';
    } else {
      result = 'Você perdeu! 😔';
    }

    const emoji = { pedra: '🪨', papel: '📄', tesoura: '✂️' };

    const embed = new EmbedBuilder()
      .setTitle('🎮 Pedra, Papel ou Tesoura')
      .addFields(
        { name: 'Sua escolha', value: `${emoji[userChoice]} ${userChoice}`, inline: true },
        { name: 'Minha escolha', value: `${emoji[botChoice]} ${botChoice}`, inline: true },
        { name: 'Resultado', value: result }
      )
      .setColor('Blue')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
