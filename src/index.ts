import express from 'express';
import { Client, GatewayIntentBits, REST, Routes, ActivityType } from 'discord.js';
import { connectMongo } from './database/mongo.js';
import { backupDatabase } from './utils/backup.js';
import { handleInteraction } from './events/interactionCreate.js';
import { handleConfigPanel } from './events/configPanel.js';
import { handleAntiSpam } from './events/antiSpam.js';
import { handleAntiLink } from './events/antiLink.js';
import { handleCloseTicket } from './events/closeTicket.js';

// Import all commands
import ping from './commands/ping.js';
import warn from './commands/warn.js';
import removewarn from './commands/removewarn.js';
import warns from './commands/warns.js';
import kick from './commands/kick.js';
import ban from './commands/ban.js';
import mute from './commands/mute.js';
import unmute from './commands/unmute.js';
import ticket from './commands/ticket.js';
import config from './commands/config.js';
import avaliacoes from './commands/avaliacoes.js';
import top from './commands/top.js';

const commands = { ping, warn, removewarn, warns, kick, ban, mute, unmute, ticket, config, avaliacoes, top };

const app = express();
app.get('/', (req, res) => res.send('Bot online!'));
app.listen(3000, () => console.log('🌐 Servidor web ativo na porta 3000'));

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) throw new Error('DISCORD_BOT_TOKEN required');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('clientReady', async () => {
  console.log(`✅ Conectado como ${client.user.tag}`);

  const commandData = Object.values(commands).map(cmd => cmd.data.toJSON());
  const rest = new REST().setToken(token);

  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commandData });
    console.log(`🔧 ${commandData.length} comando(s) registrado(s)`);
  } catch (err) {
    console.error('Erro ao registrar comandos:', err);
  }

  const statuses = [
    { text: '💸 Make your money', type: ActivityType.Watching },
    { text: '🎫 Gerenciando tickets', type: ActivityType.Watching },
    { text: '📍 Suporte 24/7', type: ActivityType.Watching }
  ];

  let statusIndex = 0;
  setInterval(() => {
    client.user.setPresence({
      activities: [{ name: statuses[statusIndex].text, type: statuses[statusIndex].type }],
      status: 'online'
    });
    statusIndex = (statusIndex + 1) % statuses.length;
  }, 10000);

  // Backup a cada 6 horas
  setInterval(() => backupDatabase(client), 6 * 60 * 60 * 1000);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isStringSelectMenu() || interaction.isButton()) {
    if (interaction.customId.startsWith('config_') || interaction.customId.startsWith('select_')) {
      return handleConfigPanel(interaction);
    }
    if (interaction.customId === 'close_ticket') {
      return handleCloseTicket(interaction);
    }
  }

  if (interaction.isChatInputCommand()) {
    return handleInteraction(interaction, commands);
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  await handleAntiSpam(message);
  await handleAntiLink(message);
});

await connectMongo();
client.login(token);
