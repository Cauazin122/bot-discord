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
    return interaction.reply({
      content: '⚠️ Configuração de Logs ainda não implementada.',
      ephemeral: true
    });
  }
}
