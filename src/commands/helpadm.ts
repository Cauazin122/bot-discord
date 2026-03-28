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
        { name: '⚠️ Warns', value: '/warn · /removewarn · /warns', inline: false },
        { name: '🔨 Moderação', value: '/kick · /ban · /mute · /unmute', inline: false },
        { name: '⚙️ Configuração', value: '/config', inline: false },
        { name: '🎫 Tickets', value: '/ticket', inline: false }
      )
      .setColor('Red')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
