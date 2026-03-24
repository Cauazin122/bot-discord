import { SlashCommandBuilder } from "discord.js";
import GuildConfig from "../models/GuildConfig.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Aplicar warn")
    .addUserOption(o =>
      o.setName("usuario")
        .setDescription("Usuário")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("motivo")
        .setDescription("Motivo")
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser("usuario");
    const motivo = interaction.options.getString("motivo") || "Sem motivo";

    let guild = await GuildConfig.findOne({ guildId: interaction.guild.id });

    if (!guild) {
      guild = await GuildConfig.create({ guildId: interaction.guild.id });
    }

    const warns = guild.warns.get(user.id) || [];

    warns.push({
      reason: motivo,
      staff: interaction.user.tag,
      date: new Date()
    });

    guild.warns.set(user.id, warns);
    await guild.save();

    await interaction.editReply(`⚠️ ${user.tag} recebeu warn.`);
  }
};
