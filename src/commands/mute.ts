import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs.ts';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutar um membro')
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
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const tempo = interaction.options.getInteger('tempo');

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
    }

    const ms = tempo * 60 * 1000;

    await member.timeout(ms);
    
    await sendLog(interaction.guild!, {
      action: 'Mute',
      user,
      staff: interaction.user,
      reason: `Tempo: ${tempo} minutos`
 });

    await interaction.reply(`🔇 ${user.tag} foi mutado por ${tempo} minutos.`);
  }
};
