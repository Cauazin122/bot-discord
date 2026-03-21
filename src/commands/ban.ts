import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banir um membro')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a ser banido')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do banimento'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo') || 'Sem motivo';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Usuário não encontrado.', ephemeral: true });
    }

    // 🔒 proteção
    if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: '❌ Você não tem permissão.', ephemeral: true });
    }

    if (member.id === interaction.guild.ownerId) {
      return interaction.reply({ content: '❌ Não pode banir o dono.', ephemeral: true });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: '❌ Hierarquia inválida.', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: '❌ Não posso banir esse usuário.', ephemeral: true });
    }

    await member.ban({ reason });

    await interaction.reply(`🔨 ${user.tag} foi banido.\nMotivo: ${reason}`);
  }
};
