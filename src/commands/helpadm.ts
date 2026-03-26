import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('helpadm')
    .setDescription('Ver comandos de administração')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📋 Comandos de Administração')
      .setDescription('Aqui estão todos os comandos de admin:')
      .addFields(
        { name: '/warn', value: 'Avisar um usuário', inline: true },
        { name: '/removewarn', value: 'Remover warn de um usuário', inline: true },
        { name: '/warns', value: 'Ver warns de um usuário', inline: true },
        { name: '/kick', value: 'Expulsar um usuário', inline: true },
        { name: '/ban', value: 'Banir um usuário', inline: true },
        { name: '/mute', value: 'Mutar um usuário', inline: true },
        { name: '/unmute', value: 'Desmutar um usuário', inline: true },
        { name: '/config', value: 'Painel de configuração do bot', inline: true },
        { name: '/avaliacoes', value: 'Ver suas avaliações', inline: true },
        { name: '/warns', value: 'Ver warns de um usuario', inline: true }
      )
      .setColor('Red')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
