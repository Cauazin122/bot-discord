import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Coupon from '../models/Coupon.js';

export default {
  data: new SlashCommandBuilder()
    .setName('removercupom')
    .setDescription('Remover um cupom de desconto')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o =>
      o.setName('codigo')
        .setDescription('Código do cupom a remover')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const rawCode = interaction.options.getString('codigo');
      const code = rawCode.trim().toUpperCase();

      const coupon = await Coupon.findOne({ code });

      if (!coupon) {
        return await interaction.editReply({
          content: `❌ Cupom \`${code}\` não encontrado. Verifique o código e tente novamente.`
        });
      }

      await Coupon.deleteOne({ code });

      const usesInfo = coupon.maxUses !== null
        ? `${coupon.currentUses}/${coupon.maxUses}`
        : `${coupon.currentUses} (ilimitado)`;

      const embed = new EmbedBuilder()
        .setTitle('🗑️ Cupom Removido')
        .setColor('Red')
        .addFields(
          { name: '🔑 Código', value: `\`${coupon.code}\``, inline: true },
          { name: '💸 Desconto', value: `${coupon.discount}%`, inline: true },
          { name: '🔢 Usos', value: usesInfo, inline: true },
          { name: '🛠️ Removido por', value: `<@${interaction.user.id}>`, inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro no comando removercupom:', error);
      await interaction.editReply({
        content: '❌ Erro ao remover o cupom. Verifique os logs.'
      });
    }
  }
};
