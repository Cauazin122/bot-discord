import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { addWarnAuto } from "../utils/autoMod.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Dar warn em um usuário")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuário").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("motivo").setDescription("Motivo").setRequired(true)
    ),

  async execute(interaction) {
    const member = interaction.options.getMember("usuario");
    const reason = interaction.options.getString("motivo");

    if (!member) {
      return interaction.reply({ content: "Usuário inválido", ephemeral: true });
    }

    await addWarnAuto(member, reason, interaction.user);

    await interaction.reply(`⚠️ ${member.user.tag} foi avisado.`);
  }
};
