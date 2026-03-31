import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../models/User.js';
import Guild from '../models/Guild.js';

const ROLE_THRESHOLDS = [
  { robux: 0, key: 'firstPurchase', label: 'Primeira Compra' },
  { robux: 1500, key: 'tier1500', label: '1.5k Rbx' },
  { robux: 2000, key: 'tier2000', label: '2k Rbx' },
  { robux: 2500, key: 'tier2500', label: '2.5k Rbx' },
  { robux: 3000, key: 'tier3000', label: '3k Rbx' },
  { robux: 3500, key: 'tier3500', label: '3.5k Rbx' },
  { robux: 4000, key: 'tier4000', label: '4k Rbx' },
  { robux: 5000, key: 'tier5000', label: '5k Rbx' },
  { robux: 6000, key: 'tier6000', label: '6k Rbx' },
  { robux: 7000, key: 'tier7000', label: '7k Rbx' },
  { robux: 10000, key: 'tier10000', label: '10k Rbx' },
  { robux: 15000, key: 'tier15000', label: '15k Rbx' },
  { robux: 20000, key: 'tier20000', label: '20k Rbx' },
  { robux: 100000, key: 'tier100000', label: '100k Rbx' }
];

export default {
  data: new SlashCommandBuilder()
    .setName('nivel')
    .setDescription('Ver seu nível de cliente')
    .addUserOption(o => o.setName('usuario').setDescription('Usuário (padrão: você)')),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const guildId = interaction.guild.id;

    const userData = await User.findOne({ userId: user.id, guildId });
    if (!userData) {
      return interaction.reply({ content: '❌ Usuário não tem compras registradas.', ephemeral: true });
    }

    const currentRobux = userData.totalRobux;
    const currentTier = ROLE_THRESHOLDS.filter(t => currentRobux >= t.robux).pop();
    const nextTier = ROLE_THRESHOLDS.find(t => currentRobux < t.robux);

    const rolesUnlocked = ROLE_THRESHOLDS
      .filter(t => currentRobux >= t.robux)
      .map(t => `✅ ${t.label}`)
      .join('\n');

    const progressText = nextTier
      ? `${currentRobux} / ${nextTier.robux} Rbx (${Math.round((currentRobux / nextTier.robux) * 100)}%)`
      : '🏆 Máximo atingido!';

    const embed = new EmbedBuilder()
      .setTitle('🎖️ Nível de Cliente')
      .setDescription(`Usuário: ${user.tag}`)
      .addFields(
        { name: '💰 Total Gasto', value: `${currentRobux} Rbx`, inline: true },
        { name: '📈 Nível Atual', value: currentTier?.label || 'Nenhum', inline: true },
        { name: '⏳ Progresso', value: progressText },
        { name: '🎖️ Cargos Desbloqueados', value: rolesUnlocked || 'Nenhum' }
      )
      .setColor('Gold')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
