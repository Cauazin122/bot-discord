import { SlashCommandBuilder } from "discord.js";
import GuildConfig from "../models/GuildConfig.js";

export default {
  data: new SlashCommandBuilder()
    .setName("removewarn")
    .setDescription("Remover warn")
    .addUserOption(o =>
      o.setName("usuario")
        .setDescription("Usuário")
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName("numero")
        .setDescription("Número do warn")
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser("usuario");
    const num = interaction.options.getInteger("numero");

    const guild = await GuildConfig.findOne({ guildId: interaction.guild.id });

    if (!guild) return interaction.editReply("Sem dados.");

    let warns = guild.warns.get(user.id) || [];

    if (!warns.length) {
      return interaction.editReply("Sem warns.");
    }

    if (num) {
      warns.splice(num - 1, 1);
    } else {
      warns = [];
    }

    guild.warns.set(user.id, warns);
    await guild.save();

    await interaction.editReply("✅ Warn removido.");
  }
};
