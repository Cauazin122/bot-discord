import { SlashCommandBuilder } from 'discord.js';
import { readDB } from '../utils/database';

export default {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Ver avisos de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const db = readDB();
    const guildId = interaction.guild.id;

    const warns = db.warns[guildId]?.[user.id] || [];

    if (warns.length === 0) {
      return interaction.reply(`✅ ${user.tag} não tem avisos.`);
    }

    const list = warns
      .map((w, i) => `**${i + 1}.** ${w.reason}`)
      .join('\n');

    await interaction.reply(`⚠️ Avisos de ${user.tag}:\n${list}`);
  }
};
