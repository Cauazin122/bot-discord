if (interaction.isButton()) {

  // 🔗 ANTI LINK
  if (interaction.customId === 'config_antilink') {
    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select_antilink')
          .setPlaceholder('Escolha uma opção')
          .addOptions([
            { label: 'Ativar neste canal', value: 'on' },
            { label: 'Desativar neste canal', value: 'off' },
          ])
      );

    return interaction.reply({
      content: 'Configurar Anti-Link:',
      components: [row],
      ephemeral: true
    });
  }

  // 🚫 ANTI SPAM (TEMPORÁRIO)
  if (interaction.customId === 'config_antispam') {
    return interaction.reply({
      content: '⚠️ Configuração de Anti-Spam ainda não implementada.',
      ephemeral: true
    });
  }

  // 📜 LOGS (TEMPORÁRIO)
  if (interaction.customId === 'config_logs') {
  const row = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_logs')
        .setPlaceholder('Escolha uma opção')
        .addOptions([
          { label: 'Definir este canal como logs', value: 'set' },
          { label: 'Remover canal de logs', value: 'remove' },
        ])
    );

  return interaction.reply({
    content: '📜 Configurar logs:',
    components: [row],
    ephemeral: true
  });
   }
  }
}
