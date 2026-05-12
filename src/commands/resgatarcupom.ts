import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import Coupon from '../models/Coupon.js';

export default {
  data: new SlashCommandBuilder()
    .setName('resgatarcupom')
    .setDescription('Resgatar um cupom de desconto')
    .addStringOption(o =>
      o.setName('codigo')
        .setDescription('Código do cupom')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const rawCode = interaction.options.getString('codigo');
      const code = rawCode.trim().toUpperCase();
      const userId = interaction.user.id;

      const coupon = await Coupon.findOne({ code });

      if (!coupon) {
        return await interaction.editReply({
          content: '❌ Cupom não encontrado. Verifique o código e tente novamente.'
        });
      }

      if (!coupon.active) {
        return await interaction.editReply({
          content: '❌ Este cupom está inativo e não pode ser resgatado.'
        });
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return await interaction.editReply({
          content: '❌ Este cupom já expirou.'
        });
      }

      if (coupon.maxUses !== null && coupon.currentUses >= coupon.maxUses) {
        return await interaction.editReply({
          content: '❌ Este cupom atingiu o limite máximo de usos.'
        });
      }

      if (coupon.usedBy.includes(userId)) {
        return await interaction.editReply({
          content: '❌ Você já resgatou este cupom anteriormente.'
        });
      }

      coupon.usedBy.push(userId);
      coupon.currentUses += 1;
      await coupon.save();

      const usesLeft = coupon.maxUses !== null
        ? `${coupon.maxUses - coupon.currentUses}`
        : 'Ilimitado';

      const embed = new EmbedBuilder()
        .setTitle('✅ Cupom Resgatado!')
        .setColor('Gold')
        .setDescription(`Parabéns, <@${userId}>! Seu desconto foi aplicado com sucesso.`)
        .addFields(
          { name: '🔑 Código', value: `\`${coupon.code}\``, inline: true },
          { name: '💸 Desconto Obtido', value: `${coupon.discount}%`, inline: true },
          { name: '🔢 Usos Restantes', value: usesLeft, inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro no comando resgatarcupom:', error);
      await interaction.editReply({
        content: '❌ Erro ao resgatar o cupom. Verifique os logs.'
      });
    }
  }
};
