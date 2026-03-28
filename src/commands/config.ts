import { 
  SlashCommandBuilder, 
  ActionRowBuilder, 
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
      .setDescription('Escolha o que deseja configurar:')
      .setColor('Blue');

    const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('config_menu')
          .setPlaceholder('Selecione uma opção...')
          .addOptions(
            { label: 'Logs', value: 'logs', emoji: '📜' },
            { label: 'Canal de Avaliações', value: 'ratings', emoji: '⭐' },
            { label: 'Roles de Staff', value: 'staffroles', emoji: '🛡️' },
            { label: 'Anti-Link', value: 'antilink', emoji: '🔗' },
            { label: 'Anti-Spam', value: 'antispam', emoji: '🚫' },
            { label: 'Categoria de Tickets', value: 'tickets', emoji: '🎫' },
            { label: 'AutoMod', value: 'automod', emoji: '⚙️' }
          )
      );

    await interaction.reply({ 
      embeds: [embed], 
      components: [dropdown],
      ephemeral: true 
    });
  }
};
