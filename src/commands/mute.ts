import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutar um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
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
    const time = interaction.options.getInteger('tempo');
    const reason = interaction.options.getString('motivo');

    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: 'Não posso mutar esse usuário.', ephemeral: true });
    }

    await member.timeout(time * 60 * 1000, reason);

    await interaction.reply(`🔇 ${user.tag} foi mutado por ${time} minutos.`);

    await sendLog(interaction.guild, {
      action: 'Usuário mutado',
      user,
      staff: interaction.user,
      reason
    });
  }
};
