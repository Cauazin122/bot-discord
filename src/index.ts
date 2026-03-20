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

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Bot online!");
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor web ativo na porta ${PORT}`);
});

const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  throw new Error("DISCORD_BOT_TOKEN environment variable is required.");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("clientReady", async (c) => {
  console.log(`✅ Conectado como ${c.user.tag}`);
  console.log(`📡 Servindo ${c.guilds.cache.size} servidor(es)`);

  const commandData = Object.values(commands).map((cmd) => cmd.data.toJSON());

  try {
    const rest = new REST().setToken(token!);
    await rest.put(Routes.applicationCommands(c.user.id), { body: commandData });
    console.log(`🔧 Registrados ${commandData.length} comando(s) slash global(ais)`);
  } catch (err) {
    console.error("Falha ao registrar comandos slash:", err);
  }

  const statuses = [
    "💸 Make your money",
    "🎫 Gerenciando tickets",
    "📍 Suporte 24/7",
    "😁 Aqui para ajudar",
  ];

  let statusIndex = 0;
  setInterval(() => {
    c.user.setPresence({
      activities: [
        {
          name: statuses[statusIndex],
          type: ActivityType.Watching,
        },
      ],
      status: "online",
    });
    statusIndex = (statusIndex + 1) % statuses.length;
  }, 10000);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    await handleSelectMenuInteraction(
      interaction as StringSelectMenuInteraction
    );
  } else if (interaction.isButton()) {
    await handleClaimTicketInteraction(interaction as ButtonInteraction);
    await handleButtonInteraction(interaction as ButtonInteraction);
  } else {
    await handleInteraction(interaction, commands);
  }
});

client.login(process.env.TOKEN);
