import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banir um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do ban')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');

    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: 'Não posso banir esse usuário.', ephemeral: true });
    }

    await member.ban({ reason });

    await interaction.reply(`🔨 ${user.tag} foi banido.`);

    await sendLog(interaction.guild, {
      action: 'Usuário banido',
      user,
      staff: interaction.user,
      reason
    });
  }
};
