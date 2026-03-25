import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Desmutar um usuário')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');

    const member = await interaction.guild.members.fetch(user.id);
    if (!member.moderatable) {
      return interaction.reply({ content: '❌ Não posso desmutar esse usuário.', ephemeral: true });
    }

    await member.timeout(null);

    await sendLog(interaction.guild, {
      action: 'Unmute',
      user,
      staff: interaction.user,
      reason: 'Desmutado'
    });

    await interaction.reply(`🔊 ${user.tag} foi desmutado.`);
  }
};
