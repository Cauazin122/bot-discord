import fs from "fs";
import GuildConfig from "../models/GuildConfig.js";

const OWNER_ID = "838197254313476147";

export async function backupDatabase(client) {
  try {
    const data = await GuildConfig.find();

    const fileName = `backup-${Date.now()}.json`;
    const filePath = `./${fileName}`;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("💾 Backup salvo");

    // 🔥 envia no privado
    const user = await client.users.fetch(OWNER_ID);

    if (user) {
      await user.send({
        content: "💾 Novo backup do bot:",
        files: [filePath]
      });
    }

  } catch (err) {
    console.error("❌ Erro no backup:", err);
  }
}
