import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuInteraction,
  ChannelType
} from 'discord.js';
import Guild from '../models/Guild.js';

export async function handleConfigPanel(interaction: StringSelectMenuInteraction | any) {
  const guildId = interaction.guild.id;
  let guild = await Guild.findOne({ guildId });

  if (!guild) {
    guild = await Guild.create({ guildId });
  }

  // MENU PRINCIPAL
  if (interaction.customId === 'config_menu') {
    const selected = interaction.values[0];

    // 📜 LOGS
    if (selected === 'logs') {
      const embed = new EmbedBuilder()
        .setTitle('📜 Configurar Logs')
        .setDescription(`Status: ${guild.logChannel ? '🟢 Configurado' : '🔴 Não configurado'}`)
        .setColor('Green');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_logs')
            .addOptions(
              { label: 'Definir canal atual', value: 'set' },
              { label: 'Remover', value: 'remove' }
            )
        );

      const backButton = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('config_back')
            .setLabel('← Voltar')
            .setStyle(ButtonStyle.Secondary)
        );

      return interaction.update({ embeds: [embed], components: [row, backButton] });
    }

    // ⭐ RATINGS CHANNEL
    if (selected === 'ratings') {
      const embed = new EmbedBuilder()
        .setTitle('⭐ Configurar Canal de Avaliações')
        .setDescription(`Status: ${guild.ratingsChannel ? '🟢 Configurado' : '🔴 Não configurado'}`)
        .setColor('Yellow');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_ratings')
            .addOptions(
              { label: 'Definir canal atual', value: 'set' },
              { label: 'Remover', value: 'remove' }
            )
        );

      const backButton = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('config_back')
            .setLabel('← Voltar')
            .setStyle(ButtonStyle.Secondary)
        );

      return interaction.update({ embeds: [embed], components: [row, backButton] });
    }

    // 🛡️ STAFF ROLES
    if (selected === 'staffroles') {
      const roles = interaction.guild.roles.cache
        .filter(r => !r.managed && r.id !== interaction.guild.id)
        .map(r => ({ label: r.name, value: r.id }))
        .slice(0, 25);

      if (roles.length === 0) {
        return interaction.reply({ content: '❌ Nenhuma role encontrada.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle('🛡️ Configurar Roles de Staff')
        .setDescription('Selecione as roles que terão acesso de staff:')
        .setColor('Blue');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_staffroles')
            .setPlaceholder('Selecione uma role...')
            .addOptions(roles)
        );

      const backButton = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('config_back')
            .setLabel('← Voltar')
            .setStyle(ButtonStyle.Secondary)
        );

      return interaction.update({ embeds: [embed], components: [row, backButton] });
    }

    // 🔗 ANTI-LINK
    if (selected === 'antilink') {
      const embed = new EmbedBuilder()
        .setTitle('🔗 Configurar Anti-Link')
        .setDescription(`Status: ${guild.antiLinkEnabled ? '🟢 Ativo' : '🔴 Desativado'}`)
        .setColor('Blue');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_antilink')
            .addOptions(
              { label: 'Ativar', value: 'on' },
              { label: 'Desativar', value: 'off' }
            )
        );

      const backButton = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('config_back')
            .setLabel('← Voltar')
            .setStyle(ButtonStyle.Secondary)
        );

      return interaction.update({ embeds: [embed], components: [row, backButton] });
    }

    // 🚫 ANTI-SPAM
    if (selected === 'antispam') {
      const embed = new EmbedBuilder()
        .setTitle('🚫 Configurar Anti-Spam')
        .setDescription(`Status: ${guild.antiSpamEnabled ? '🟢 Ativo' : '🔴 Desativado'}`)
        .setColor('Red');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_antispam')
            .addOptions(
              { label: 'Ativar', value: 'on' },
              { label: 'Desativar', value: 'off' }
            )
        );

      const backButton = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('config_back')
            .setLabel('← Voltar')
            .setStyle(ButtonStyle.Secondary)
        );

      return interaction.update({ embeds: [embed], components: [row, backButton] });
    }

    // 🎫 TICKETS
    if (selected === 'tickets') {
      const categories = interaction.guild.channels.cache
        .filter(c => c.type === ChannelType.GuildCategory)
        .map(c => ({ label: c.name, value: c.id }))
        .slice(0, 25);

      if (categories.length === 0) {
        return interaction.reply({ content: '❌ Nenhuma categoria encontrada.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle('🎫 Selecionar Categoria')
        .setDescription('Escolha onde os tickets serão criados.')
        .setColor('Purple');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_tickets')
            .setPlaceholder('Selecione uma categoria...')
            .addOptions(categories)
        );

      const backButton = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('config_back')
            .setLabel('← Voltar')
            .setStyle(ButtonStyle.Secondary)
        );

      return interaction.update({ embeds: [embed], components: [row, backButton] });
    }

    // ⚙️ AUTOMOD
    if (selected === 'automod') {
      const embed = new EmbedBuilder()
        .setTitle('⚙️ Configurar AutoMod')
        .setDescription(`Mute: ${guild.autoMod.muteAt}\nKick: ${guild.autoMod.kickAt}`)
        .setColor('Yellow');

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('select_automod')
            .addOptions(
              { label: 'Mute: 3', value: 'mute_3' },
              { label: 'Mute: 5', value: 'mute_5' },
              { label: 'Mute: 7', value: 'mute_7' },
              { label: 'Kick: 5', value: 'kick_5' },
              { label: 'Kick: 7', value: 'kick_7' },
              { label: 'Kick: 10', value: 'kick_10' }
            )
        );

      const backButton = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('config_back')
            .setLabel('← Voltar')
            .setStyle(ButtonStyle.Secondary)
        );

      return interaction.update({ embeds: [embed], components: [row, backButton] });
    }
  }

  // VOLTAR AO MENU PRINCIPAL
  if (interaction.customId === 'config_back') {
    const embed = new EmbedBuilder()
      .setTitle('⚙️ Painel de Configuração')
      .setDescription('Escolha o que deseja configurar:')
      .setColor('Blue');

    const dropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('config_menu')
          .setPlaceholder('Selecione uma opção...')
          .addOptions(
            { label: 'Logs', value: 'logs', emoji: '📜' },
            { label: 'Canal de Avaliações', value: 'ratings', emoji: '⭐' },
            { label: 'Roles de Staff', value: 'staffroles', emoji: '🛡️' },
            { label: 'Anti-Link', value: 'antilink', emoji: '🔗' },
            { label: 'Anti-Spam', value: 'antispam', emoji: '🚫' },
            { label: 'Categoria de Tickets', value: 'tickets', emoji: '🎫' },
            { label: 'AutoMod', value: 'automod', emoji: '⚙️' }
          )
      );

    return interaction.update({ embeds: [embed], components: [dropdown] });
  }

  // SUB-SELEÇÕES
  if (interaction.customId === 'select_logs') {
    if (interaction.values[0] === 'set') {
      guild.logChannel = interaction.channelId;
    } else {
      guild.logChannel = undefined;
    }
    await guild.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ Logs Atualizado')
      .setDescription(`Canal: ${interaction.values[0] === 'set' ? `<#${interaction.channelId}>` : 'Removido'}`)
      .setColor('Green');

    const backButton = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('config_back')
          .setLabel('← Voltar')
          .setStyle(ButtonStyle.Secondary)
      );

    return interaction.update({ embeds: [embed], components: [backButton] });
  }

  if (interaction.customId === 'select_ratings') {
    if (interaction.values[0] === 'set') {
      guild.ratingsChannel = interaction.channelId;
    } else {
      guild.ratingsChannel = undefined;
    }
    await guild.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ Canal de Avaliações Atualizado')
      .setDescription(`Canal: ${interaction.values[0] === 'set' ? `<#${interaction.channelId}>` : 'Removido'}`)
      .setColor('Green');

    const backButton = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('config_back')
          .setLabel('← Voltar')
          .setStyle(ButtonStyle.Secondary)
      );

    return interaction.update({ embeds: [embed], components: [backButton] });
  }

  if (interaction.customId === 'select_staffroles') {
    const roleId = interaction.values[0];
    if (!guild.staffRoles.includes(roleId)) {
      guild.staffRoles.push(roleId);
    } else {
      guild.staffRoles = guild.staffRoles.filter((r: string) => r !== roleId);
    }
    await guild.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ Roles de Staff Atualizadas')
      .setDescription(`Role: <@&${roleId}>`)
      .setColor('Green');

    const backButton = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('config_back')
          .setLabel('← Voltar')
          .setStyle(ButtonStyle.Secondary)
      );

    return interaction.update({ embeds: [embed], components: [backButton] });
  }

  if (interaction.customId === 'select_antilink') {
    guild.antiLinkEnabled = interaction.values[0] === 'on';
    await guild.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ Anti-Link Atualizado')
      .setDescription(`Status: ${guild.antiLinkEnabled ? '🟢 Ativo' : '🔴 Desativado'}`)
      .setColor('Green');

    const backButton = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('config_back')
          .setLabel('← Voltar')
          .setStyle(ButtonStyle.Secondary)
      );

    return interaction.update({ embeds: [embed], components: [backButton] });
  }

  if (interaction.customId === 'select_antispam') {
    guild.antiSpamEnabled = interaction.values[0] === 'on';
    await guild.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ Anti-Spam Atualizado')
      .setDescription(`Status: ${guild.antiSpamEnabled ? '🟢 Ativo' : '🔴 Desativado'}`)
      .setColor('Green');

    const backButton = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('config_back')
          .setLabel('← Voltar')
          .setStyle(ButtonStyle.Secondary)
      );

    return interaction.update({ embeds: [embed], components: [backButton] });
  }

  if (interaction.customId === 'select_tickets') {
    guild.ticketCategory = interaction.values[0];
    await guild.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ Categoria de Tickets Atualizada')
      .setDescription(`Categoria: <#${interaction.values[0]}>`)
      .setColor('Green');

    const backButton = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('config_back')
          .setLabel('← Voltar')
          .setStyle(ButtonStyle.Secondary)
      );

    return interaction.update({ embeds: [embed], components: [backButton] });
  }

  if (interaction.customId === 'select_automod') {
    const value = interaction.values[0];
    if (value.startsWith('mute')) {
      guild.autoMod.muteAt = parseInt(value.split('_')[1]);
    }
    if (value.startsWith('kick')) {
      guild.autoMod.kickAt = parseInt(value.split('_')[1]);
    }
    await guild.save();

    const embed = new EmbedBuilder()
      .setTitle('✅ AutoMod Atualizado')
      .setDescription(`Mute: ${guild.autoMod.muteAt}\nKick: ${guild.autoMod.kickAt}`)
      .setColor('Green');

    const backButton = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('config_back')
          .setLabel('← Voltar')
          .setStyle(ButtonStyle.Secondary)
      );

    return interaction.update({ embeds: [embed], components: [backButton] });
  }
}
