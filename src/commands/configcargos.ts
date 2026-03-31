import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../models/Guild.js';

const ROLE_KEYS = [
  { key: 'firstPurchase', label: 'Primeira Compra', robux: '0' },
  { key: 'tier1500', label: '1.5k Rbx', robux: '1500' },
  { key: 'tier2000', label: '2k Rbx', robux: '2000' },
  { key: 'tier2500', label: '2.5k Rbx', robux: '2500' },
  { key: 'tier3000', label: '3k Rbx', robux: '3000' },
  { key: 'tier3500', label: '3.5k Rbx', robux: '3500' },
  { key: 'tier4000', label: '4k Rbx', robux: '4000' },
  { key: 'tier5000', label: '5k Rbx', robux: '5000' },
  { key: 'tier6000', label: '6k Rbx', robux: '6000' },
  { key: 'tier7000', label: '7k Rbx', robux: '7000' },
  { key: 'tier10000', label: '10k Rbx', robux: '10000' },
  { key: 'tier15000', label: '15k Rbx', robux: '15000' },
  { key: 'tier20000', label: '20k Rbx', robux: '20000' },
  { key: 'tier100000', label: '100k Rbx', robux: '100000' }
];

export default {
  data: new SlashCommandBuilder()
    .setName('configcargos')
    .setDescription('Configurar cargos de cliente')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o =>
      o.setName('tier')
        .setDescription('Qual tier configurar')
        .setRequired(true)
        .addChoices(...ROLE_KEYS.map(r => ({ name: `${r.label} (${r.robux} Rbx)`, value: r.key })))
    )
    .addRoleOption(o => o.setName('cargo').setDescription('Cargo a atribuir').setRequired(true)),

  async execute(interaction) {
    const tier = interaction.options.getString('tier');
    const role = interaction.options.getRole('cargo');
    const guildId = interaction.guild.id;

    let guild = await Guild.findOne({ guildId });
    if (!guild) {
      guild = await Guild.create({ guildId });
    }

    if (!guild.customerRoles) {
      guild.customerRoles = {};
    }

    guild.customerRoles[tier] = role.id;
    await guild.save();

    const tierLabel = ROLE_KEYS.find(r => r.key === tier)?.label;

    const embed = new EmbedBuilder()
      .setTitle('✅ Cargo Configurado')
      .setDescription(`Tier: **${tierLabel}**`)
      .addFields(
        { name: '🎖️ Cargo', value: `${role}`, inline: true }
      )
      .setColor('Green')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
