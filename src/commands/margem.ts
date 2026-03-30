import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  data: new SlashCommandBuilder()
    .setName('margem')
    .setDescription('Alterar margem de venda')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addNumberOption(o =>
      o.setName('percentual')
        .setDescription('Percentual de margem (ex: 30 para 30%)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(500)
    ),

  async execute(interaction) {
    const percentual = interaction.options.getNumber('percentual');
    const margem = 1 + (percentual / 100);
    const guildId = interaction.guild.id;

    let guild = await Guild.findOne({ guildId });
    if (!guild) {
      guild = await Guild.create({ guildId });
    }

    guild.margemVenda = margem;
    await guild.save();

    const embed = new EmbedBuilder()
      .setTitle('📊 Margem Atualizada')
      .setDescription(`Nova margem: **${percentual}%**`)
      .addFields(
        { name: 'Multiplicador', value: `${margem.toFixed(2)}x`, inline: true },
        { name: 'Exemplo', value: `100 Robux = R$ ${(100 * 0.05 * margem).toFixed(2)}`, inline: true }
      )
      .setColor('Green')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
