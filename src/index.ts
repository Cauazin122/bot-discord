import express from "express";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes
} from "discord.js";

import { commands } from "./commands/index.js";
import { handleInteraction } from "./events/interactionCreate.js";
import { connectMongo } from "./database/mongo.js";

const app = express();
app.get("/", (req, res) => res.send("Bot online"));
app.listen(3000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

const token = process.env.DISCORD_BOT_TOKEN;

client.once("clientReady", async () => {
  console.log(`✅ Logado como ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(token);

  const cmds = Object.values(commands).map(c => c.data.toJSON());

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: cmds }
    );

    console.log("✅ Comandos registrados");
  } catch (err) {
    console.error("Erro ao registrar comandos:", err);
  }
});

client.on("interactionCreate", i => handleInteraction(i, commands));

await connectMongo();
client.login(token);
