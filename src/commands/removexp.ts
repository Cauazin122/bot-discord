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
    .setName('removexp')
    .setDescription('Remover Robux de um usuário (sistema de cargos)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(o => o.setName('usuario').setDescription('Usuário').setRequired(true))
    .addNumberOption(o => o.setName('robux').setDescription('Quantidade de Robux a remover').setRequired(true).setMinValue(1)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const user = interaction.options.getUser('usuario');
      const robuxAmount = interaction.options.getNumber('robux');
      const guildId = interaction.guild.id;

      // Buscar usuário
      const userData = await User.findOne({ userId: user.id, guildId });
      if (!userData) {
        return await interaction.editReply({
          content: '❌ Usuário não tem compras registradas.'
        });
      }

      userData.totalRobux = Math.max(0, userData.totalRobux - robuxAmount);
      await userData.save();

      // Buscar guild
      const guild = await Guild.findOne({ guildId });
      if (!guild) {
        return await interaction.editReply({
          content: '❌ Servidor não configurado. Contate um administrador.'
        });
      }

      // Verificar se customerRoles existe
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

      // Determinar quais cargos remover (acima do novo total) e quais manter (abaixo ou igual)
      const rolesToRemove = [];
      const rolesRemovedLabels = [];

      for (const threshold of ROLE_THRESHOLDS) {
        const roleId = guild.customerRoles[threshold.key];
        if (!roleId) continue;

        if (userData.totalRobux < threshold.robux) {
          // Usuário não qualifica mais para este cargo — remover se presente
          if (member.roles.cache.has(roleId)) {
            rolesToRemove.push(roleId);
            rolesRemovedLabels.push(threshold.label);
          }
        }
        // Roles at or below the new total are left untouched (kept)
      }

      // Remover cargos em batch
      if (rolesToRemove.length > 0) {
        try {
          await member.roles.remove(rolesToRemove);
        } catch (err) {
          console.error('Erro ao remover roles:', err);
          return await interaction.editReply({
            content: '❌ Erro ao remover cargos. Verifique as permissões do bot.'
          });
        }
      }

      const embed = new EmbedBuilder()
        .setTitle('✅ XP Removido')
        .addFields(
          { name: '👤 Usuário', value: user.tag, inline: true },
          { name: '💰 Robux Removido', value: `${robuxAmount}`, inline: true },
          { name: '📊 Total', value: `${userData.totalRobux} Rbx`, inline: true },
          {
            name: '🎖️ Cargos Removidos',
            value: rolesRemovedLabels.length > 0 ? rolesRemovedLabels.join('\n') : 'Nenhum cargo removido'
          }
        )
        .setColor('Orange')
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro no comando removexp:', error);
      await interaction.editReply({
        content: '❌ Erro ao processar comando. Verifique os logs.'
      });
    }
  }
};
