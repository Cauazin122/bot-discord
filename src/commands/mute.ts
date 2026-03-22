import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { sendLog } from '../utils/logs';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutar um usuário')
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
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do mute')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const time = interaction.options.getInteger('tempo');
    const reason = interaction.options.getString('motivo') || 'Não informado';

    const member = interaction.guild.members.cache.get(user.id);

    // ❌ usuário não encontrado
    if (!member) {
      return interaction.reply({
        content: '❌ Usuário não encontrado.',
        ephemeral: true
      });
    }

    // ❌ não pode mutar
    if (!member.moderatable) {
      return interaction.reply({
        content: '❌ Não posso mutar esse usuário.',
        ephemeral: true
      });
    }

    // 🔇 aplica mute
    await member.timeout(time * 60 * 1000, reason);

    // ✅ resposta correta (COM MOTIVO)
    await interaction.reply(
      `🔇 ${user.tag} foi mutado por ${time} minutos.\n📄 Motivo: ${reason}`
    );

    // 📜 log (COM TEMPO SEPARADO)
    await sendLog(interaction.guild, {
      action: 'Usuário mutado',
      user,
      staff: interaction.user,
      reason,
      time: `${time} minutos`
    });
  }
};
