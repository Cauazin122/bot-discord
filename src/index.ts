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

  const commandData = Object.values(commands).map(cmd => cmd.data.toJSON());

  const rest = new REST().setToken(token!);

  // 🔥 USE GUILD PRA TESTE
  await rest.put(
    Routes.applicationGuildCommands(c.user.id, "SEU_SERVER_ID"),
    { body: commandData }
  );
});

// ✅ INTERAÇÕES (SEU PADRÃO ORIGINAL + CONFIG INTEGRADO)
client.on("interactionCreate", async (interaction) => {

  // 🔥 SELECT MENU
  if (interaction.isStringSelectMenu()) {

    // 👉 CONFIG PANEL PRIMEIRO (MAS SEM BLOQUEAR)
    if (interaction.customId.startsWith('select_')) {
      return configPanel.execute(interaction);
    }

    return handleSelectMenuInteraction(
      interaction as StringSelectMenuInteraction
    );
  }

  // 🔘 BOTÕES
  else if (interaction.isButton()) {

    // 👉 CONFIG PANEL
    if (interaction.customId.startsWith('config_')) {
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

// ✅ EVENTOS DE MENSAGEM (SEM MEXER)
client.on(antiSpam.name, (...args) => antiSpam.execute(...args));
client.on(antiLink.name, (...args) => antiLink.execute(...args));

client.login(token);
