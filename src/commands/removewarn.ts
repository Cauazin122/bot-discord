import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../models/Guild.js';
import User from '../models/User.js';
import { sendLog } from '../utils/logs.js';

export default {
  data: new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Remove warn de um usuário')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(true))
    .addIntegerOption(o => o.setName('numero').setDescription('Número do warn'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');
    const num = interaction.options.getInteger('numero');
    const guildId = interaction.guild.id;

    const guild = await Guild.findOne({ guildId });
    if (!guild) {
      return interaction.reply({ content: '❌ Servidor não configurado.', ephemeral: true });
    }

    const userWarns = guild.warns.filter(w => w.userId === user.id);
    if (!userWarns.length) {
      return interaction.reply({ content: '❌ Usuário sem warns.', ephemeral: true });
    }

    if (num) {
      guild.warns = guild.warns.filter((w, i) => !(w.userId === user.id && i === num - 1));
    } else {
      guild.warns = guild.warns.filter(w => w.userId !== user.id);
    }

    const userData = await User.findOne({ userId: user.id, guildId });
    if (userData) {
      userData.warns = guild.warns.filter(w => w.userId === user.id).length;
      await userData.save();
    }

    await guild.save();

    await sendLog(interaction.guild, {
      action: 'Warn',
      user,
      staff: interaction.user,
      reason
    });

    await interaction.reply(`✅ Warn removido. Total: ${guild.warns.filter(w => w.userId === user.id).length}`);
  }
};
