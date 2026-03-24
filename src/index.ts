import express from "express";
import {
  Client,
  GatewayIntentBits,
  ActivityType,
  REST,
  Routes
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

const app = express();
app.get("/", (req, res) => res.send("Bot online!"));
app.listen(3000);

// 🔥 CONECTA ANTES DE TUDO
await connectMongo();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const token = process.env.DISCORD_BOT_TOKEN;

// ✅ READY
client.once("clientReady", async () => {
  console.log(`✅ Logado como ${client.user.tag}`);

  const commandData = Object.values(commands)
    .filter(cmd => cmd.data)
    .map(cmd => cmd.data.toJSON());

  const rest = new REST().setToken(token);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commandData }
    );
    console.log("✅ Comandos registrados");
  } catch (err) {
    console.error("❌ Erro ao registrar comandos:", err);
  }

  client.user.setPresence({
    activities: [{ name: "Gerenciando servidor 🚀", type: ActivityType.Watching }],
    status: "online"
  });
});

// 🔥 INTERAÇÕES
client.on("interactionCreate", async (interaction) => {

  try {

    // SELECT MENU
    if (interaction.isStringSelectMenu()) {
      if (
        interaction.customId === "select_antilink" ||
        interaction.customId === "select_logs"
      ) {
        return configPanel.execute(interaction);
      }

      return handleSelectMenuInteraction(interaction);
    }

    // BOTÕES
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("config_")) {
        return configPanel.execute(interaction);
      }

      await handleClaimTicketInteraction(interaction);
      return handleButtonInteraction(interaction);
    }

    // COMANDOS
    if (interaction.isChatInputCommand()) {
      await handleInteraction(interaction, commands);
    }

  } catch (err) {
    console.error("❌ Erro geral:", err);

    if (!interaction.replied) {
      await interaction.reply({
        content: "❌ Erro ao executar comando.",
        ephemeral: true
      });
    }
  }
});

// EVENTOS
client.on(antiSpam.name, (...args) => antiSpam.execute(...args));
client.on(antiLink.name, (...args) => antiLink.execute(...args));

client.login(token);
