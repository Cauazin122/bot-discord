import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import User from '../models/User.js';
import Guild from '../models/Guild.js';

const ROLE_THRESHOLDS = [
  { robux: 0, key: 'firstPurchase', label: 'Primeira Compra' },
  { robux: 1500, key: 'tier1500', label: '1.5k Rbx' },
  { robux: 2000, key: 'tier2000', label: '2k Rbx' },
  { robux: 2500, key: 'tier2500', label: '2.5k Rbx' },
  { robux: 3000, key: 'tier3000', label: '3k Rbx' },
  { robux: 3500, key: 'tier3500', label: '3.5k Rbx' },
  { robux: 4000, key: 'tier4000', label: '4k Rbx' },
  { robux: 5000, key: 'tier5000', label: '5k Rbx' },
  { robux: 6000, key: 'tier6000', label: '6k Rbx' },
  { robux: 7000, key: 'tier7000', label: '7k Rbx' },
  { robux: 10000, key: 'tier10000', label: '10k Rbx' },
  { robux: 15000, key: 'tier15000', label: '15k Rbx' },
  { robux: 20000, key: 'tier20000', label: '20k Rbx' },
  { robux: 100000, key: 'tier100000', label: '100k Rbx' }
];

export default {
  data: new SlashCommandBuilder()
    .setName('addxp')
    .setDescription('Adicionar Robux a um usuário (sistema de cargos)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(o => o.setName('usuario').setDescription('Usuário').setRequired(true))
    .addNumberOption(o => o.setName('robux').setDescription('Quantidade de Robux').setRequired(true).setMinValue(1)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const robuxAmount = interaction.options.getNumber('robux');
    const guildId = interaction.guild.id;

    let userData = await User.findOne({ userId: user.id, guildId });
    if (!userData) {
      userData = await User.create({ userId: user.id, guildId, totalRobux: robuxAmount });
    } else {
      userData.totalRobux += robuxAmount;
      await userData.save();
    }

    const guild = await Guild.findOne({ guildId });
    if (!guild?.customerRoles) {
      return interaction.reply({ content: '❌ Cargos de cliente não configurados.', ephemeral: true });
    }

    // Dar todos os cargos que o usuário atingiu (sem desperdiçar XP)
    const member = await interaction.guild.members.fetch(user.id);
    const rolesGiven = [];

    for (const threshold of ROLE_THRESHOLDS) {
      if (userData.totalRobux >= threshold.robux && guild.customerRoles[threshold.key]) {
        try {
          await member.roles.add(guild.customerRoles[threshold.key]);
          rolesGiven.push(threshold.label);
        } catch (err) {
          console.error(`Erro ao adicionar role ${threshold.key}:`, err);
        }
      }
    }

    const embed = new EmbedBuilder()
      .setTitle('✅ XP Adicionado')
      .addFields(
        { name: '👤 Usuário', value: user.tag, inline: true },
        { name: '💰 Robux Adicionado', value: `${robuxAmount}`, inline: true },
        { name: '📊 Total', value: `${userData.totalRobux} Rbx`, inline: true },
        { name: '🎖️ Cargos Recebidos', value: rolesGiven.length > 0 ? rolesGiven.join('\n') : 'Nenhum cargo novo' }
      )
      .setColor('Green')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
