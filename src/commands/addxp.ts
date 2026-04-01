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
    await interaction.deferReply({ ephemeral: true });

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

      // Buscar guild
      let guild = await Guild.findOne({ guildId });
      if (!guild) {
        return await interaction.editReply({
          content: '❌ Servidor não configurado. Contate um administrador.'
        });
      }

      // Verificar se customerRoles existe e tem cargos
      if (!guild.customerRoles || Object.keys(guild.customerRoles).length === 0) {
        return await interaction.editReply({
          content: '❌ Nenhum cargo de cliente configurado. Use `/configcargos` para configurar.'
        });
      }

      // Buscar membro
      let member;
      try {
        member = await interaction.guild.members.fetch({ user: user.id, force: false });
      } catch (err) {
        return await interaction.editReply({
          content: '❌ Usuário não encontrado no servidor.'
        });
      }

      // Coletar IDs de roles a adicionar (sem fazer requisições)
      const rolesToAdd = [];
      const rolesLabels = [];

      for (const threshold of ROLE_THRESHOLDS) {
        if (userData.totalRobux >= threshold.robux && guild.customerRoles[threshold.key]) {
          const roleId = guild.customerRoles[threshold.key];
          if (roleId && !member.roles.cache.has(roleId)) {
            rolesToAdd.push(roleId);
            rolesLabels.push(threshold.label);
          }
        }
      }

      // Adicionar todos os cargos de uma vez (batch)
      if (rolesToAdd.length > 0) {
        try {
          await member.roles.add(rolesToAdd);
        } catch (err) {
          console.error('Erro ao adicionar roles:', err);
          return await interaction.editReply({
            content: '❌ Erro ao adicionar cargos. Verifique as permissões do bot.'
          });
        }
      }

      const embed = new EmbedBuilder()
        .setTitle('✅ XP Adicionado')
        .addFields(
          { name: '👤 Usuário', value: user.tag, inline: true },
          { name: '💰 Robux Adicionado', value: `${robuxAmount}`, inline: true },
          { name: '📊 Total', value: `${userData.totalRobux} Rbx`, inline: true },
          {
            name: '🎖️ Cargos Recebidos',
            value: rolesLabels.length > 0 ? rolesLabels.join('\n') : 'Nenhum cargo novo'
          }
        )
        .setColor('Green')
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro no comando addxp:', error);
      await interaction.editReply({
        content: '❌ Erro ao processar comando. Verifique os logs.'
      });
    }
  }
};
