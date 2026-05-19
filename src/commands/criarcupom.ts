import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Coupon from '../models/Coupon.js';

function generateCode(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default {
  data: new SlashCommandBuilder()
    .setName('criarcupom')
    .setDescription('Criar um cupom de desconto')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addNumberOption(o =>
      o.setName('desconto')
        .setDescription('Percentual de desconto (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .addNumberOption(o =>
      o.setName('quantidade')
        .setDescription('Quantidade máxima de usos (deixe vazio para ilimitado)')
        .setRequired(false)
        .setMinValue(1)
    )
    .addNumberOption(o =>
      o.setName('expiracao')
        .setDescription('Validade em dias (deixe vazio para sem expiração)')
        .setRequired(false)
        .setMinValue(1)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const discount = interaction.options.getNumber('desconto');
      const maxUses = interaction.options.getNumber('quantidade') ?? null;
      const expirationDays = interaction.options.getNumber('expiracao') ?? null;

      // Gera um código único, tentando novamente em caso de colisão
      let code: string;
      let attempts = 0;
      do {
        code = generateCode(8);
        const existing = await Coupon.findOne({ code });
        if (!existing) break;
        attempts++;
      } while (attempts < 5);

      const expiresAt = expirationDays
        ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000)
        : null;

      await Coupon.create({
        code,
        discount,
        maxUses,
        currentUses: 0,
        usedBy: [],
        createdBy: interaction.user.id,
        expiresAt,
        active: true
      });

      const embed = new EmbedBuilder()
        .setTitle('🎟️ Cupom Criado com Sucesso')
        .setColor('Green')
        .addFields(
          { name: '🔑 Código', value: `\`${code}\``, inline: true },
          { name: '💸 Desconto', value: `${discount}%`, inline: true },
          {
            name: '🔢 Usos Disponíveis',
            value: maxUses !== null ? `${maxUses}` : 'Ilimitado',
            inline: true
          },
          {
            name: '⏳ Expiração',
            value: expiresAt
              ? `<t:${Math.floor(expiresAt.getTime() / 1000)}:F>`
              : 'Sem expiração',
            inline: true
          },
          { name: '👤 Criado por', value: `<@${interaction.user.id}>`, inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro no comando criarcupom:', error);
      await interaction.editReply({
        content: '❌ Erro ao criar o cupom. Verifique os logs.'
      });
    }
  }
};
