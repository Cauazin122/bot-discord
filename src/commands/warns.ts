import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
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

    const description = warns.map((w, i) => {
      const date = new Date(w.date).toLocaleString('pt-BR');

      return `**${i + 1}.** 📄 Motivo: ${w.reason}
👮 Staff: <@${w.staff}>
📅 Data: ${date}`;
    }).join('\n\n');

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Avisos de ${user.tag}`)
      .setDescription(description)
      .setColor('Orange')
      .setFooter({ text: `Total de warns: ${warns.length}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
