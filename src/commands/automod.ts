import { SlashCommandBuilder } from "discord.js";
import GuildConfig from "../models/GuildConfig.js";

export default {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Configurar automod")
    .addIntegerOption(o =>
      o.setName("mute").setDescription("Warns para mute")
    )
    .addIntegerOption(o =>
      o.setName("kick").setDescription("Warns para kick")
    ),

  async execute(interaction) {
    const mute = interaction.options.getInteger("mute");
    const kick = interaction.options.getInteger("kick");

    let guild = await GuildConfig.findOne({
      guildId: interaction.guild.id
    });

    if (!guild) guild = await GuildConfig.create({
      guildId: interaction.guild.id
    });

    if (mute) guild.autoMod.mute = mute;
    if (kick) guild.autoMod.kick = kick;

    await guild.save();

    await interaction.reply("✅ Automod atualizado.");
  }
};
