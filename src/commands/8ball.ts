import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const responses = [
  'Sim! 🎉',
  'Não! ❌',
  'Talvez... 🤔',
  'Com certeza! ✅',
  'Definitivamente não! 🚫',
  'Pergunte novamente 🔮',
  'Sinais apontam para sim 👍',
  'Não conte com isso 😅',
  'Muito provável! 🌟',
  'Improvável... 😔'
];

export default {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Faça uma pergunta para a bola mágica')
    .addStringOption(o =>
      o.setName('pergunta').setDescription('Sua pergunta').setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('pergunta');
    const response = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setTitle('🔮 Bola Mágica')
      .addFields(
        { name: '❓ Pergunta', value: question },
        { name: '🎱 Resposta', value: response }
      )
      .setColor('Purple')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
