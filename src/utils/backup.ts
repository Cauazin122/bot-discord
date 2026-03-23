import fs from "fs";
import GuildConfig from "../models/GuildConfig.js";

export async function backupDatabase() {
  try {
    const data = await GuildConfig.find();

    const backup = JSON.stringify(data, null, 2);

    fs.writeFileSync(`./backup.json`, backup);

    console.log("💾 Backup salvo com sucesso");
  } catch (err) {
    console.error("❌ Erro ao fazer backup:", err);
  }
}
