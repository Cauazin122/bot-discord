import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsar um membro')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a ser expulso')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do kick')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: 'Não posso expulsar esse usuário.', ephemeral: true });
    }

    await member.kick(reason);

    await interaction.reply(`👢 ${user.tag} foi expulso.\nMotivo: ${reason}`);
  }
};
