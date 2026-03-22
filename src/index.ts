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

// ✅ CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// ✅ READY
client.once("clientReady", async (c) => {
  console.log(`✅ Conectado como ${c.user.tag}`);
  console.log(`📡 Servindo ${c.guilds.cache.size} servidor(es)`);

  const commandData = Object.values(commands).map((cmd) => cmd.data.toJSON());

  try {
    const rest = new REST().setToken(token!);

    // 🔥 USE ISSO PRA TESTE (ATUALIZA NA HORA)
    await rest.put(
      Routes.applicationGuildCommands(c.user.id, "SEU_SERVER_ID_AQUI"),
      { body: commandData }
    );

    console.log(`🔧 Comandos registrados (guild)`);
  } catch (err) {
    console.error("Erro ao registrar comandos:", err);
  }

  // 🔥 STATUS ROTATIVO
  const statuses = [
    { text: "💸 Make your money", type: ActivityType.Watching },
    { text: "Jogando GTA 6 🚗💨", type: ActivityType.Playing },
    { text: "🎫 Gerenciando tickets", type: ActivityType.Watching },
    { text: "📍 Suporte 24/7", type: ActivityType.Watching },
    { text: "😁 Aqui para ajudar", type: ActivityType.Watching },
  ];

  let statusIndex = 0;

  setInterval(() => {
    c.user.setPresence({
      activities: [
        {
          name: statuses[statusIndex].text,
          type: statuses[statusIndex].type,
        },
      ],
      status: "online",
    });

    statusIndex = (statusIndex + 1) % statuses.length;
  }, 10000);
});

// ✅ INTERAÇÕES (CORRIGIDO SEM CONFLITO)
client.on("interactionCreate", async (interaction) => {

  // 🔥 CONFIG PANEL (SÓ QUANDO FOR DELE)
  if (
    (interaction.isButton() && interaction.customId.startsWith('config_')) ||
    (interaction.isStringSelectMenu() && interaction.customId.startsWith('select_'))
  ) {
    return configPanel.execute(interaction);
  }

  // 🎫 SELECT MENU (tickets)
  if (interaction.isStringSelectMenu()) {
    await handleSelectMenuInteraction(
      interaction as StringSelectMenuInteraction
    );
  } 
  
  // 🔘 BOTÕES
  else if (interaction.isButton()) {
    await handleClaimTicketInteraction(interaction as ButtonInteraction);
    await handleButtonInteraction(interaction as ButtonInteraction);
  } 
  
  // 💬 COMANDOS
  else {
    await handleInteraction(interaction, commands);
  }
});

// ✅ EVENTOS DE MENSAGEM
client.on(antiSpam.name, (...args) => antiSpam.execute(...args));
client.on(antiLink.name, (...args) => antiLink.execute(...args));

// ✅ LOGIN
client.login(token);
