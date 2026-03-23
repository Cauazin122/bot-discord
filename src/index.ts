import express from "express";
import {
  Client,
  GatewayIntentBits,
  ActivityType,
  REST,
  Routes,
  StringSelectMenuInteraction,
  ButtonInteraction,
} from "discord.js";
import { commands } from "./commands/index.js";
import { handleInteraction } from "./events/interactionCreate.js";
import { handleButtonInteraction } from "./events/buttonCreate.js";
import { handleSelectMenuInteraction } from "./events/selectMenuCreate.js";
import { handleClaimTicketInteraction } from "./events/claimTicketCreate.js";
import antiSpam from "./events/antiSpam.js";
import antiLink from "./events/antiLink.js";
import configPanel from "./events/configPanel.js";
import { connectMongo } from "./database/mongo.js";
import { backupDatabase } from "./utils/backup.js";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Bot online!");
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor web ativo na porta ${PORT}`);
});

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) throw new Error("DISCORD_BOT_TOKEN environment variable is required.");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// ✅ READY (corrigido aviso também)
client.once("clientReady", async () => {
  console.log(`✅ Conectado como ${client.user?.tag}`);
  console.log(`📡 Servindo ${client.guilds.cache.size} servidor(es)`);

  const commandData = Object.values(commands)
    .filter(cmd => cmd.data)
    .map(cmd => cmd.data.toJSON());

  try {
    const rest = new REST().setToken(token);
    await rest.put(Routes.applicationCommands(client.user!.id), { body: commandData });
    console.log(`🔧 Registrados ${commandData.length} comando(s)`);
  } catch (err) {
    console.error("Falha ao registrar comandos slash:", err);
  }

  const statuses = [
    { text: "💸 Make your money", type: ActivityType.Watching },
    { text: "Jogando GTA 6 🚗💨", type: ActivityType.Playing },
    { text: "🎫 Gerenciando tickets", type: ActivityType.Watching },
    { text: "📍 Suporte 24/7", type: ActivityType.Watching },
    { text: "😁 Aqui para ajudar", type: ActivityType.Watching },
  ];

  let statusIndex = 0;

  setInterval(() => {
    client.user?.setPresence({
      activities: [{ name: statuses[statusIndex].text, type: statuses[statusIndex].type }],
      status: "online",
    });

    statusIndex = (statusIndex + 1) % statuses.length;
  }, 10000);
});

// ✅ INTERAÇÕES CORRIGIDAS (SEM CONFLITO)
client.on("interactionCreate", async (interaction) => {

  // 🔽 SELECT MENU
  if (interaction.isStringSelectMenu()) {

    // 🔥 APENAS IDS DO CONFIG
    if (
      interaction.customId === 'select_antilink' ||
      interaction.customId === 'select_logs' ||
      interaction.customId === 'select_automod'
    ) {
      return configPanel.execute(interaction);
    }

    // 🎫 TICKET
    return handleSelectMenuInteraction(
      interaction as StringSelectMenuInteraction
    );
  }

  // 🔘 BOTÕES
  else if (interaction.isButton()) {

    if (
      interaction.customId === 'config_antilink' ||
      interaction.customId === 'config_logs' ||
      interaction.customId === 'config_antispam' ||
      interaction.customId === 'config_automod'
    ) {
      return configPanel.execute(interaction);
    }

    await handleClaimTicketInteraction(interaction as ButtonInteraction);
    return handleButtonInteraction(interaction as ButtonInteraction);
  }

  // 💬 COMANDOS
  else {
    return handleInteraction(interaction, commands);
  }
});

// 🔥 EVENTOS
client.on(antiSpam.name, (...args) => antiSpam.execute(...args));
client.on(antiLink.name, (...args) => antiLink.execute(...args));

await connectMongo();

client.login(token);
