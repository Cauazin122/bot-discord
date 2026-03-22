import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from 'discord.js';

import { sendLog } from '../utils/logs.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutar um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a ser mutado')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('tempo')
        .setDescription('Tempo em minutos')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do mute')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {

    const user = interaction.options.getUser('usuario');
    const tempo = interaction.options.getInteger('tempo');
    const motivo = interaction.options.getString('motivo');

    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({
        content: '❌ Usuário não encontrado.',
        ephemeral: true
      });
    }

    // Evita staff
    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ Não pode mutar um staff.',
        ephemeral: true
      });
    }

    try {
      await member.timeout(tempo * 60 * 1000, motivo);

      await interaction.reply({
        content: `🔇 ${user.tag} foi mutado por ${tempo} minuto(s). Motivo: ${motivo}`
      });

      // 🔥 LOG
      await sendLog(interaction.guild, {
        action: 'Mute',
        user,
        staff: interaction.user,
        reason: `${motivo} (${tempo} min)`
      });

    } catch (err) {
      console.error(err);

      return interaction.reply({
        content: '❌ Erro ao mutar.',
        ephemeral: true
      });
    }
  }
};
