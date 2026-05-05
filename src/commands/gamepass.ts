import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Guild from '../models/Guild.js';

export default {
  data: new SlashCommandBuilder()
    .setName('gamepass')
    .setDescription('Gera instruções de preço para criação de gamepass')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o =>
      o.setName('tipo')
        .setDescription('Com taxa (você recebe exato) ou sem taxa (Roblox desconta 30%)')
        .setRequired(true)
        .addChoices(
          { name: 'Com Taxa — você recebe exatamente o valor desejado', value: 'com_taxa' },
          { name: 'Sem Taxa — Roblox desconta 30% do valor', value: 'sem_taxa' }
        )
    )
    .addIntegerOption(o =>
      o.setName('robux')
        .setDescription('Quantidade de Robux que deseja receber')
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption(o =>
      o.setName('descricao')
        .setDescription('Descrição adicional para exibir na embed')
        .setRequired(false)
    ),

  async execute(interaction) {
    const tipo = interaction.options.getString('tipo');
    const robuxDesejado = interaction.options.getInteger('robux');
    const descricao = interaction.options.getString('descricao');

    const guildId = interaction.guild.id;
    const guild = await Guild.findOne({ guildId });
    const taxa = guild?.taxaRobux || 0.05;

    let valorGamepass: number;
    let valorReais: string;
    let explicacao: string;
    let recebimento: string;

    if (tipo === 'com_taxa') {
      // Para receber exatamente `robuxDesejado`, a gamepass precisa custar mais,
      // pois o Roblox retém 30% — logo o criador recebe apenas 70% do valor.
      // Fórmula: valor_gamepass = robuxDesejado / 0.7
      valorGamepass = Math.ceil(robuxDesejado / 0.7);
      valorReais = (valorGamepass * taxa).toFixed(2);
      explicacao =
        `O valor da gamepass já inclui os **30% retidos pelo Roblox**.\n` +
        `Ao definir **${valorGamepass} Robux** na gamepass, você receberá exatamente **${robuxDesejado} Robux** após o desconto.`;
      recebimento = `✅ Você receberá: **${robuxDesejado} Robux**`;
    } else {
      // Sem ajuste de taxa: a gamepass vale exatamente o que o usuário pediu,
      // mas o Roblox desconta 30% — então o criador recebe apenas 70%.
      valorGamepass = robuxDesejado;
      valorReais = (valorGamepass * taxa).toFixed(2);
      const robuxRecebido = Math.floor(robuxDesejado * 0.7);
      explicacao =
        `O valor da gamepass **não** inclui os 30% retidos pelo Roblox.\n` +
        `Ao definir **${valorGamepass} Robux** na gamepass, o Roblox descontará 30% e você receberá apenas **${robuxRecebido} Robux**.`;
      recebimento = `⚠️ Você receberá: **${robuxRecebido} Robux** (após desconto de 30%)`;
    }

    const tipoLabel = tipo === 'com_taxa' ? '✅ Com Taxa' : '⚠️ Sem Taxa';
    const cor = tipo === 'com_taxa' ? 0x57f287 : 0xfee75c; // Verde : Amarelo

    const embed = new EmbedBuilder()
      .setTitle('🎮 Gamepass — Instruções de Preço')
      .setDescription(descricao || 'Siga as instruções abaixo para configurar o preço da sua gamepass corretamente.')
      .addFields(
        { name: '📋 Tipo', value: tipoLabel, inline: true },
        { name: '🎯 Robux Desejados', value: `**${robuxDesejado} Robux**`, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: '🏷️ Valor da Gamepass', value: `Crie uma gamepass no valor de: **${valorGamepass} Robux** (R$ ${valorReais})`, inline: false },
        { name: '📊 Detalhes', value: explicacao, inline: false },
        { name: '💰 Recebimento', value: recebimento, inline: false },
      )
      .setColor(cor)
      .setTimestamp()
      .setFooter({ text: `Solicitado por ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });
  }
};
