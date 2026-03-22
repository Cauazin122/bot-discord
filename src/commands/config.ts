import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Painel de configuração')
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
      content: '⚙️ Painel de configuração:',
      components: [row],
      ephemeral: true
    });
  }
};
