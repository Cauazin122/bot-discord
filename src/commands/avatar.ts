import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Ver avatar de um usuário')
    .addUserOption(o =>
      o.setName('usuario').setDescription('Usuário (padrão: você)')
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`Avatar de ${user.tag}`)
      .setImage(user.avatarURL({ size: 512 }))
      .setColor('Blue')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
