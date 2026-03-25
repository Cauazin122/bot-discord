import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banir um usuário')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');

    const member = await interaction.guild.members.fetch(user.id);
    if (!member.bannable) {
      return interaction.reply({ content: '❌ Não posso banir esse usuário.', ephemeral: true });
    }

    await member.ban({ reason });

    await sendLog(interaction.guild, {
      action: 'Ban',
      user,
      staff: interaction.user,
      reason
    });

    await interaction.reply(`🔨 ${user.tag} foi banido.`);
  }
};
