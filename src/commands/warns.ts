import {
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js';

import { readDB } from '../utils/database.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Ver os avisos de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const guildId = interaction.guild.id;

    const db = readDB();

    const warns = db.warns?.[guildId]?.[user.id] || [];
    const config = db.autoMod?.[guildId] || { mute: 3, kick: 5 };

    if (warns.length === 0) {
      return interaction.reply({
        content: '❌ Esse usuário não possui warns.',
        ephemeral: true
      });
    }

    const description = warns
      .map((w, i) =>
        `**${i + 1}.** 📄 Motivo: ${w.reason}\n👮 Staff: ${w.staff}\n📅 ${w.date}`
      )
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Avisos de ${user.username}`)
      .setDescription(description)
      .addFields({
        name: '⚙️ AutoMod',
        value: `🔇 Mute: ${config.mute} warns\n👢 Kick: ${config.kick} warns`
      })
      .setColor('Orange')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
