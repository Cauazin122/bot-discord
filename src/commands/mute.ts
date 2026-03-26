import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutar um usuário')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(true))
    .addIntegerOption(o => o.setName('tempo').setDescription('Tempo em minutos').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');
    const time = interaction.options.getInteger('tempo');

    const member = await interaction.guild.members.fetch(user.id);
    if (!member.moderatable) {
      return interaction.reply({ content: '❌ Não posso mutar esse usuário.', ephemeral: true });
    }

    await member.timeout(time * 60 * 1000, reason);

    await sendLog(interaction.guild, {
      action: 'Mute',
      user,
      staff: interaction.user,
      reason
    });

    await interaction.reply(`🔇 ${user.tag} foi mutado por ${time} minuto(s).`);
  }
};
