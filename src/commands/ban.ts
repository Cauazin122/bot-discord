import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banir um membro')
    .addUserOption(option =>
      option
        .setName('usuario')
        .setDescription('Usuário a ser banido')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('motivo')
        .setDescription('Motivo do ban')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: 'Não posso banir esse usuário.', ephemeral: true });
    }

    await member.ban({ reason });
    
    await sendLog(interaction.guild!, {
      action: 'Banimento',
      user,
      staff: interaction.user,
      reason
 });

    await interaction.reply(`✅ ${user.tag} foi banido.\nMotivo: ${reason}`);
  }
};
