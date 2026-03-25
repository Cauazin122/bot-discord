import Guild from '../models/Guild.js';

const OWNER_ID = '838197254313476147';

export async function backupDatabase(client) {
  try {
    const guilds = await Guild.find();

    const fileName = `backup-${Date.now()}.json`;
    const filePath = `./${fileName}`;

    const fs = await import('fs');
    fs.writeFileSync(filePath, JSON.stringify(guilds, null, 2));

    console.log('💾 Backup salvo');

    const user = await client.users.fetch(OWNER_ID);
    if (user) {
      await user.send({
        content: '💾 Novo backup do bot:',
        files: [filePath]
      });
    }

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('❌ Erro no backup:', err);
  }
}
