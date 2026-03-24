import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mutar membro")
    .addUserOption(o =>
      o.setName("usuario")
        .setDescription("Usuário")
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName("tempo")
        .setDescription("Tempo em minutos")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const tempo = interaction.options.getInteger("tempo");

    const member = interaction.guild.members.cache.get(user.id);

    await member.timeout(tempo * 60000);

    await interaction.reply(`🔇 ${user.tag} mutado por ${tempo} min.`);
  }
};
