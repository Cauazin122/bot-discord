import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { readDB, writeDB } from '../utils/database';

export default {
  data: new SlashCommandBuilder()
    .setName('antilink')
    .setDescription('Ativar ou desativar anti-link neste canal')
    .addStringOption(option =>
      option.setName('acao')
        .setDescription('Ativar ou desativar')
        .setRequired(true)
        .addChoices(
          { name: 'ativar', value: 'on' },
          { name: 'desativar', value: 'off' }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const action = interaction.options.getString('acao');
    const db = readDB();

    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    if (!db.antiLink[guildId]) {
      db.antiLink[guildId] = [];
    }

    if (action === 'on') {
      if (!db.antiLink[guildId].includes(channelId)) {
        db.antiLink[guildId].push(channelId);
      }

      await interaction.reply('✅ Anti-link ativado neste canal.');
    }

    if (action === 'off') {
      db.antiLink[guildId] = db.antiLink[guildId].filter(id => id !== channelId);

      await interaction.reply('❌ Anti-link desativado neste canal.');
    }

    writeDB(db);
  }
};
