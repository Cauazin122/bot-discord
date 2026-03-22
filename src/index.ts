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

// ✅ Evento correto é 'ready'
client.once("ready", async () => {
  console.log(`✅ Conectado como ${client.user?.tag}`);
  console.log(`📡 Servindo ${client.guilds.cache.size} servidor(es)`);

  // Evita crash se algum comando estiver undefined
  const commandData = Object.values(commands)
    .filter(cmd => cmd.data)       // filtra comandos sem .data
    .map(cmd => cmd.data.toJSON());

  try {
    const rest = new REST().setToken(token);
    await rest.put(Routes.applicationCommands(client.user!.id), { body: commandData });
    console.log(`🔧 Registrados ${commandData.length} comando(s) slash global(ais)`);
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

client.on("interactionCreate", async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    await handleSelectMenuInteraction(interaction as StringSelectMenuInteraction);
  } else if (interaction.isButton()) {
    await handleClaimTicketInteraction(interaction as ButtonInteraction);
    await handleButtonInteraction(interaction as ButtonInteraction);
  } else {
    await handleInteraction(interaction, commands);
  }
});

// Anti-spam e Anti-link
client.on(antiSpam.name, (...args) => antiSpam.execute(...args));
client.on(antiLink.name, (...args) => antiLink.execute(...args));

client.login(token);
