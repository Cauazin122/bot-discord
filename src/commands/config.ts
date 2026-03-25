import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Painel de configuração')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('⚙️ Painel de Configuração')
      .setDescription('Escolha uma opção:')
      .setColor('Blue');

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder().setCustomId('config_logs').setLabel('Logs').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('config_antilink').setLabel('Anti-Link').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('config_antispam').setLabel('Anti-Spam').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('config_automod').setLabel('AutoMod').setStyle(ButtonStyle.Success)
      );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
