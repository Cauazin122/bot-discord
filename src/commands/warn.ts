import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs';

const warns = new Map();

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avisar um membro')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');

    const userWarns = warns.get(user.id) || 0;
    warns.set(user.id, userWarns + 1);

    await interaction.reply(`⚠️ ${user.tag} recebeu um aviso (${userWarns + 1}/3)`);

    await sendLog(interaction.guild!, {
      action: 'Aviso',
      user,
      staff: interaction.user,
      reason
    });

    // Sistema automático
    if (userWarns + 1 >= 3) {
      const member = await interaction.guild.members.fetch(user.id);
      await member.timeout(10 * 60 * 1000);

      await interaction.followUp(`🔇 ${user.tag} foi mutado automaticamente por excesso de avisos.`);
    }
  }
};
