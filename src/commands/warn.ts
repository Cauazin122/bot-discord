import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../models/Guild.js';
import User from '../models/User.js';
import { sendLog } from '../utils/logs.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avisar um usuário')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário').setRequired(true))
    .addStringOption(o => o.setName('motivo').setDescription('Motivo').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');
    const guildId = interaction.guild.id;

    const guild = await Guild.findOne({ guildId });
    if (!guild) {
      return interaction.reply({ content: '❌ Servidor não configurado.', ephemeral: true });
    }

    guild.warns.push({
      userId: user.id,
      reason,
      staff: interaction.user.tag,
      date: new Date()
    });

    let userData = await User.findOne({ userId: user.id, guildId });
    if (!userData) {
      userData = await User.create({ userId: user.id, guildId, warns: 1 });
    } else {
      userData.warns += 1;
    }

    await guild.save();
    await userData.save();

    await sendLog(interaction.guild, {
      action: 'Warn',
      user,
      staff: interaction.user,
      reason
    });

    // AutoMod
    if (userData.warns === guild.autoMod.muteAt) {
      const member = await interaction.guild.members.fetch(user.id);
      await member.timeout(10 * 60 * 1000, 'Limite de warns atingido');

      await sendLog(interaction.guild, {
        action: 'Auto Mute',
        user,
        staff: interaction.client.user,
        reason: `${guild.autoMod.muteAt} warns`
      });
    }

    if (userData.warns === guild.autoMod.kickAt) {
      const member = await interaction.guild.members.fetch(user.id);
      await member.kick('Limite de warns atingido');

      await sendLog(interaction.guild, {
        action: 'Auto Kick',
        user,
        staff: interaction.client.user,
        reason: `${guild.autoMod.kickAt} warns`
      });
    }

    await interaction.reply(`⚠️ ${user.tag} foi avisado. Total: ${userData.warns}`);
  }
};
