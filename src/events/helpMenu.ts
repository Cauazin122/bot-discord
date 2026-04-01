import { StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ButtonInteraction } from 'discord.js';

const CATEGORIES = {
  diversao: {
    title: '🎮 Diversão',
    description: 'Comandos para se divertir',
    commands: [
      { name: '/8ball', desc: 'Faça uma pergunta e receba uma resposta aleatória' },
      { name: '/dice', desc: 'Role um dado de 6 lados' },
      { name: '/coinflip', desc: 'Jogue uma moeda (cara ou coroa)' },
      { name: '/rps', desc: 'Jogue pedra, papel ou tesoura' },
      { name: '/avatar', desc: 'Veja o avatar de um usuário' }
    ]
  },
  tickets: {
    title: '🎫 Tickets',
    description: 'Sistema de suporte',
    commands: [
      { name: '/ticket', desc: 'Abrir um novo ticket de suporte (admin)' }
    ]
  },
  moderacao: {
    title: '⚠️ Moderação',
    description: 'Comandos de moderação (admin)',
    commands: [
      { name: '/warn', desc: 'Avisar um usuário' },
      { name: '/removewarn', desc: 'Remover warn de um usuário' },
      { name: '/kick', desc: 'Expulsar um usuário do servidor' },
      { name: '/ban', desc: 'Banir um usuário do servidor' },
      { name: '/mute', desc: 'Mutar um usuário' },
      { name: '/unmute', desc: 'Desmutar um usuário' }
    ]
  },
  ranking: {
    title: '📊 Ranking',
    description: 'Comandos de ranking e estatísticas',
    commands: [
      { name: '/top', desc: 'Ver o ranking de clientes' },
      { name: '/warns', desc: 'Ver warns de um usuário' },
      { name: '/nivel', desc: 'Ver seu nível de cliente e cargos desbloqueados' }
    ]
  },
  loja: {
    title: '💰 Loja',
    description: 'Sistema de loja e calculadora',
    commands: [
      { name: '/calcular', desc: 'Calcular preço de gamepass em Real' },
      { name: '/taxa', desc: 'Alterar taxa de conversão Robux → Real (admin)' },
      { name: '/margem', desc: 'Alterar margem de venda (admin)' },
      { name: '/configcargos', desc: 'Configurar cargos de cliente (admin)' },
      { name: '/addxp', desc: 'Adicionar Robux a um usuário (admin)' },
      { name: '/removexp', desc: 'Remover Robux de um usuário (admin)' }
    ]
  },
  config: {
    title: '⚙️ Configuração',
    description: 'Comandos de configuração do servidor',
    commands: [
      { name: '/config', desc: 'Painel de configuração do bot' }
    ]
  },
  info: {
    title: '❓ Informações',
    description: 'Comandos de informações gerais',
    commands: [
      { name: '/ping', desc: 'Ver latência do bot' },
      { name: '/help', desc: 'Ver este menu de ajuda' }
    ]
  }
};

export async function handleHelpMenu(interaction: StringSelectMenuInteraction) {
  if (interaction.customId !== 'help_category') return;

  const category = interaction.values[0];
  const categoryData = CATEGORIES[category];

  if (!categoryData) {
    return interaction.reply({ content: '❌ Categoria não encontrada.', ephemeral: true });
  }

  const commandsList = categoryData.commands
    .map(cmd => `**${cmd.name}** - ${cmd.desc}`)
    .join('\n');

  const embed = new EmbedBuilder()
    .setTitle(categoryData.title)
    .setDescription(categoryData.description)
    .addFields(
      { name: '📋 Comandos', value: commandsList }
    )
    .setColor('Blue')
    .setFooter({ text: 'Use o botão abaixo para voltar' })
    .setTimestamp();

  const backButton = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('help_back')
        .setLabel('← Voltar')
        .setStyle(ButtonStyle.Secondary)
    );

  await interaction.update({ embeds: [embed], components: [backButton] });
}

export async function handleHelpBack(interaction: ButtonInteraction) {
  if (interaction.customId !== 'help_back') return;

  const embed = new EmbedBuilder()
    .setTitle('📚 Central de Ajuda')
    .setDescription('Selecione uma categoria para ver os comandos disponíveis')
    .addFields(
      { name: '🎮 Diversão', value: '8ball, dice, coinflip, rps, avatar', inline: false },
      { name: '🎫 Tickets', value: 'ticket', inline: false },
      { name: '⚠️ Moderação', value: 'warn, removewarn, kick, ban, mute, unmute', inline: false },
      { name: '📊 Ranking', value: 'top, warns, nivel', inline: false },
      { name: '💰 Loja', value: 'calcular, taxa, margem, configcargos, addxp, removexp', inline: false },
      { name: '⚙️ Configuração', value: 'config', inline: false },
      { name: '❓ Informações', value: 'ping, help', inline: false }
    )
    .setColor('Blue')
    .setFooter({ text: 'Clique em uma categoria para ver mais detalhes' })
    .setTimestamp();

  const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('help_category')
        .setPlaceholder('Selecione uma categoria...')
        .addOptions(
          { label: '🎮 Diversão', value: 'diversao', emoji: '🎮' },
          { label: '🎫 Tickets', value: 'tickets', emoji: '🎫' },
          { label: '⚠️ Moderação', value: 'moderacao', emoji: '⚠️' },
          { label: '📊 Ranking', value: 'ranking', emoji: '📊' },
          { label: '💰 Loja', value: 'loja', emoji: '💰' },
          { label: '⚙️ Configuração', value: 'config', emoji: '⚙️' },
          { label: '❓ Informações', value: 'info', emoji: '❓' }
        )
    );

  await interaction.update({ embeds: [embed], components: [dropdown] });
}
