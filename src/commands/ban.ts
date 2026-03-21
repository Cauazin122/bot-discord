import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';

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

  async execute(interaction: ChatInputCommandInteraction) {

    const user = interaction.options.getUser('usuario', true);
    const reason = interaction.options.getString('motivo') || 'Sem motivo';

    if (!interaction.guild) {
      return interaction.reply({ content: '❌ Esse comando só pode ser usado em servidor.', ephemeral: true });
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Usuário não encontrado.', ephemeral: true });
    }

    // 🔒 Permissão
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: '❌ Você não tem permissão.', ephemeral: true });
    }

    // 👑 Dono
    if (member.id === interaction.guild.ownerId) {
      return interaction.reply({ content: '❌ Não pode banir o dono.', ephemeral: true });
    }

    // 🪜 Hierarquia
    if (interaction.member && 'roles' in interaction.member) {
      if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({ content: '❌ Hierarquia inválida.', ephemeral: true });
      }
    }

    // 🤖 Bot permissão
    if (!member.bannable) {
      return interaction.reply({ content: '❌ Não posso banir esse usuário.', ephemeral: true });
    }

    await member.ban({ reason });

    return interaction.reply({
      content: `🔨 ${user.tag} foi banido.\nMotivo: ${reason}`
    });
  }
};
