import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} from 'discord.js';

const PIX_KEY = '2201a56a-c1b7-4df5-9ca7-48c965683993';
const PIX_EMAIL = 'flixshopofc@gmail.com';

export default {
  data: new SlashCommandBuilder()
    .setName('pix')
    .setDescription('Exibe as chaves PIX da Flixshop')
    .addStringOption(o =>
      o.setName('mensagem')
        .setDescription('Mensagem customizada exibida na embed')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const mensagem =
      interaction.options.getString('mensagem') ??
      'Use os botões abaixo para copiar a chave desejada e realizar seu pagamento via PIX.';

    const embed = new EmbedBuilder()
      .setTitle('💳 Chaves PIX - Flixshop')
      .setDescription(mensagem)
      .addFields(
        { name: '🔑 Chave Aleatória', value: `\`${PIX_KEY}\``, inline: false },
        { name: '📧 E-mail', value: `\`${PIX_EMAIL}\``, inline: false }
      )
      .setColor('Green')
      .setTimestamp()
      .setFooter({ text: 'Flixshop • Pagamentos via PIX' });

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('copy_pix_key')
          .setLabel('📋 Copiar Chave')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('copy_pix_email')
          .setLabel('📧 Copiar Email')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
