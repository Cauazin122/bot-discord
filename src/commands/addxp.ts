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
    try {
      const user = interaction.options.getUser('usuario');
      const robuxAmount = interaction.options.getNumber('robux');
      const guildId = interaction.guild.id;

      // Buscar ou criar usuário
      let userData = await User.findOne({ userId: user.id, guildId });
      if (!userData) {
        userData = await User.create({ userId: user.id, guildId, totalRobux: robuxAmount });
      } else {
        userData.totalRobux += robuxAmount;
        await userData.save();
      }

      // Buscar ou criar guild
      let guild = await Guild.findOne({ guildId });
      if (!guild) {
        guild = await Guild.create({ guildId });
      }

      // Verificar se customerRoles existe
      if (!guild.customerRoles) {
        guild.customerRoles = {};
        await guild.save();
      }

      // Contar quantos cargos estão configurados
      const configuredRoles = Object.values(guild.customerRoles).filter(r => r).length;
      if (configuredRoles === 0) {
        return interaction.reply({
          content: '❌ Nenhum cargo de cliente configurado. Use `/configcargos` para configurar.',
          ephemeral: true
        });
      }

      // Buscar membro
      let member;
      try {
        member = await interaction.guild.members.fetch(user.id);
      } catch (err) {
        return interaction.reply({
          content: '❌ Usuário não encontrado no servidor.',
          ephemeral: true
        });
      }

      // Dar todos os cargos que o usuário atingiu
      const rolesGiven = [];
      const rolesAlreadyHad = [];

      for (const threshold of ROLE_THRESHOLDS) {
        if (userData.totalRobux >= threshold.robux && guild.customerRoles[threshold.key]) {
          try {
            const roleId = guild.customerRoles[threshold.key];
            if (!member.roles.cache.has(roleId)) {
              await member.roles.add(roleId);
              rolesGiven.push(threshold.label);
            } else {
              rolesAlreadyHad.push(threshold.label);
            }
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
          {
            name: '🎖️ Cargos Novos',
            value: rolesGiven.length > 0 ? rolesGiven.join('\n') : 'Nenhum cargo novo'
          },
          {
            name: '✅ Cargos Já Possuía',
            value: rolesAlreadyHad.length > 0 ? rolesAlreadyHad.join('\n') : 'Nenhum'
          }
        )
        .setColor('Green')
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Erro no comando addxp:', error);
      await interaction.reply({
        content: '❌ Erro ao processar comando. Verifique os logs.',
        ephemeral: true
      });
    }
  }
};
