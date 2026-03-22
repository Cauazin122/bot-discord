import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction
} from 'discord.js';

import { sendLog } from '../utils/logs.js';

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

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('usuario');
    const tempo = interaction.options.getInteger('tempo');

    const member = interaction.guild?.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: '❌ Usuário não encontrado.', ephemeral: true });
    }

    await member.timeout(tempo * 60 * 1000);

    await interaction.reply({
      content: `🔇 ${user.tag} foi mutado por ${tempo} minuto(s).`
    });

    // 📜 LOG
    await sendLog(interaction.guild, {
      action: 'Mute',
      user: user,
      staff: interaction.user,
      reason: `${tempo} minuto(s)`
    });
  }
};
