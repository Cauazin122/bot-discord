import { 
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder, 
  PermissionFlagsBits,
  StringSelectMenuBuilder
} from 'discord.js';

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

    // 🔘 BOTÕES (mantidos)
    const buttons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder().setCustomId('config_logs').setLabel('Logs').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('config_antilink').setLabel('Anti-Link').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('config_antispam').setLabel('Anti-Spam').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('config_automod').setLabel('AutoMod').setStyle(ButtonStyle.Success)
      );

    // 📜 DROPDOWN MENU (NOVO)
    const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('config_menu')
          .setPlaceholder('Selecione uma opção...')
          .addOptions(
            {
              label: '📜 Logs',
              value: 'logs'
            },
            {
              label: '🔗 Anti-Link',
              value: 'antilink'
            },
            {
              label: '🚫 Anti-Spam',
              value: 'antispam'
            },
            {
              label: '🎫 Categoria de Tickets',
              value: 'tickets'
            },
            {
              label: '⚙️ AutoMod',
              value: 'automod'
            }
          )
      );

    await interaction.reply({ 
      embeds: [embed], 
      components: [dropdown, buttons], // 👈 adicionamos aqui
      ephemeral: true 
    });
  }
};
