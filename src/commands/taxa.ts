import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  data: new SlashCommandBuilder()
    .setName('taxa')
    .setDescription('Alterar taxa de conversão Robux → Real')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addNumberOption(o =>
      o.setName('valor')
        .setDescription('Nova taxa (ex: 0.05)')
        .setRequired(true)
        .setMinValue(0.01)
        .setMaxValue(1)
    ),

  async execute(interaction) {
    const novaTaxa = interaction.options.getNumber('valor');
    const guildId = interaction.guild.id;

    let guild = await Guild.findOne({ guildId });
    if (!guild) {
      guild = await Guild.create({ guildId });
    }

    guild.taxaRobux = novaTaxa;
    await guild.save();

    const embed = new EmbedBuilder()
      .setTitle('💱 Taxa Atualizada')
      .setDescription(`Nova taxa: **1 Robux = R$ ${novaTaxa.toFixed(2)}**`)
      .setColor('Green')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
