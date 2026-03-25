import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsar um usuário')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');

    const member = await interaction.guild.members.fetch(user.id);
    if (!member.kickable) {
      return interaction.reply({ content: '❌ Não posso expulsar esse usuário.', ephemeral: true });
    }

    await member.kick(reason);

    await sendLog(interaction.guild, {
      action: 'Kick',
      user,
      staff: interaction.user,
      reason
    });

    await interaction.reply(`👢 ${user.tag} foi expulso.`);
  }
};
