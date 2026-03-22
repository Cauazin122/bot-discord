import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs';

export default {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Desmutar um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a ser desmutado')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do desmute')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo') || 'Não informado';

    const member = interaction.guild.members.cache.get(user.id);

    // ❌ usuário não encontrado
    if (!member) {
      return interaction.reply({
        content: '❌ Usuário não encontrado.',
        ephemeral: true
      });
    }

    // ❌ não pode desmutar
    if (!member.moderatable) {
      return interaction.reply({
        content: '❌ Não posso desmutar esse usuário.',
        ephemeral: true
      });
    }

    // ❌ não está mutado
    if (!member.communicationDisabledUntilTimestamp) {
      return interaction.reply({
        content: '❌ Esse usuário não está mutado.',
        ephemeral: true
      });
    }

    // 🔊 remove mute
    await member.timeout(null, reason);

    // ✅ resposta
    await interaction.reply(
      `🔊 ${user.tag} foi desmutado.\n📄 Motivo: ${reason}`
    );

    // 📜 log
    await sendLog(interaction.guild, {
      action: 'Usuário desmutado',
      user,
      staff: interaction.user,
      reason
    });
  }
};
