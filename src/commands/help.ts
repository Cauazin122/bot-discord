import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Ver todos os comandos disponíveis'),

  async execute(interaction) {
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

    await interaction.reply({ embeds: [embed], components: [dropdown] });
  }
};
