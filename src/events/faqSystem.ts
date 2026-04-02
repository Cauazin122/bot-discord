import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Guild from '../models/Guild.js';

const FAQ_KEYWORDS = {
  legitimidade: {
    keywords: ['é real', 'fake', 'legítimo', 'confiável', 'é verdade', 'é seguro', 'é confiável'],
    answer: '✅ **Somos uma loja legítima de Roblox!**\n\n' +
            '• Suporte 24/7 disponível\n' +
            '• Garantia de satisfação\n\n' +
            'Se ainda tiver dúvidas, abra um ticket para falar com nossa equipe!'
  },
  pagamento: {
    keywords: ['como pagar', 'qual forma de pagamento', 'aceita pix', 'cartão', 'boleto'],
    answer: '💳 **Formas de Pagamento**\n\n' +
            '• PIX (instantâneo)\n' +
            '• Transferência Bancária\n\n' +
            'Todas as transações são seguras e criptografadas.\n' +
            'Abra um ticket para mais informações!'
  },
  entrega: {
    keywords: ['quanto tempo', 'demora quanto', 'quando recebo', 'prazo de entrega'],
    answer: '⏱️ **Tempo de Entrega**\n\n' +
            '• Todas as entregas serão feitas na hora\n' +
            '• Robux via gamepass demora entre 5 a 6 dias (padrão do roblox)\n' +
            'Caso não receba em ate 72 horas abra um ticket!'
  },
  suporte: {
    keywords: ['suporte', 'problema', 'erro', 'não recebi', 'dúvida'],
    answer: '🆘 **Precisa de Ajuda?**\n\n' +
            'Nossa equipe de suporte está disponível 24/7!\n\n' +
            '• Abra um ticket clicando no botão abaixo\n' +
            '• Descreva seu problema\n' +
            '• Aguarde resposta da equipe\n\n' +
            'Respondemos em menos de 1 hora!'
  }
};

const FAQ_COOLDOWN = 5 * 60 * 1000; // 5 minutos

export async function handleFAQ(message: Message) {
  if (message.author.bot) return;
  if (!message.guild) return;

  const guildId = message.guild.id;
  const userId = message.author.id;
  const content = message.content.toLowerCase();

  // Verificar se a mensagem contém palavras-chave
  let matchedCategory: string | null = null;
  for (const [category, data] of Object.entries(FAQ_KEYWORDS)) {
    if (data.keywords.some(keyword => content.includes(keyword))) {
      matchedCategory = category;
      break;
    }
  }

  if (!matchedCategory) return;

  // Buscar guild
  let guild = await Guild.findOne({ guildId });
  if (!guild) {
    guild = await Guild.create({ guildId });
  }

  // Verificar cooldown
  if (!guild.faqCooldowns) {
    guild.faqCooldowns = [];
  }

  const userCooldown = guild.faqCooldowns.find(c => c.userId === userId);
  const now = new Date();

  if (userCooldown && (now.getTime() - userCooldown.lastFaqTime.getTime()) < FAQ_COOLDOWN) {
    // Usuário ainda está em cooldown, não responder
    return;
  }

  // Atualizar cooldown
  if (userCooldown) {
    userCooldown.lastFaqTime = now;
  } else {
    guild.faqCooldowns.push({ userId, lastFaqTime: now });
  }

  // Limpar cooldowns antigos (mais de 1 hora)
  guild.faqCooldowns = guild.faqCooldowns.filter(c => {
    return (now.getTime() - c.lastFaqTime.getTime()) < 60 * 60 * 1000;
  });

  await guild.save();

  // Enviar resposta
  const faqData = FAQ_KEYWORDS[matchedCategory];

  const embed = new EmbedBuilder()
    .setTitle('❓ Resposta Frequente')
    .setDescription(faqData.answer)
    .setColor('Blue')
    .setFooter({ text: 'Próxima resposta disponível em 5 minutos' })
    .setTimestamp();

  const ticketButton = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket_from_faq')
        .setLabel('Abrir Ticket')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎫')
    );

  try {
    await message.reply({ embeds: [embed], components: [ticketButton] });
  } catch (err) {
    console.error('Erro ao enviar FAQ:', err);
  }
}
