import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Ver warns de um usuário')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const guildId = interaction.guild.id;

    const guild = await Guild.findOne({ guildId });
    if (!guild) {
      return interaction.reply({ content: '❌ Servidor não configurado.', ephemeral: true });
    }

    const warns = guild.warns.filter(w => w.userId === user.id);
    if (!warns.length) {
      return interaction.reply({ content: '❌ Usuário sem warns.', ephemeral: true });
    }

    const description = warns
      .map((w, i) => `**${i + 1}.** ${w.reason}\n👮 ${w.staff}\n📅 ${w.date.toLocaleDateString('pt-BR')}`)
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Warns de ${user.username}`)
      .setDescription(description)
      .addFields({
        name: '⚙️ AutoMod',
        value: `🔇 Mute: ${guild.autoMod.muteAt}\n👢 Kick: ${guild.autoMod.kickAt}`
      })
      .setColor('Orange')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
