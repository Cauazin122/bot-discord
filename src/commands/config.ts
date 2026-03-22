import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Painel de configurações do servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('⚙️ Painel de Configuração')
      .setDescription(
        'Use os botões abaixo para configurar o sistema do bot:\n\n' +
        '🔗 **Anti-Link**\n' +
        '🚫 **Anti-Spam**\n' +
        '📜 **Logs**'
      )
      .setColor('Blue')
      .setFooter({ text: 'Sistema de configuração' });

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('config_antilink')
          .setLabel('Anti-Link')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('config_antispam')
          .setLabel('Anti-Spam')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('config_logs')
          .setLabel('Logs')
          .setStyle(ButtonStyle.Success)
      );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};
