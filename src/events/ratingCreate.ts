import fs from "fs";
import path from "path";
import { ButtonInteraction } from "discord.js";
import { config } from "../config.js";

export async function handleRatingInteraction(interaction: ButtonInteraction) {
  const customId = interaction.customId;
  if (!["rate_1", "rate_2", "rate_3", "rate_4", "rate_5"].includes(customId))
    return;

  const rating = customId.replace("rate_", "");

  try {
    const dbPath = path.join(process.cwd(), "database.json");

    const dbData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbData);

    db.avaliacoes.push({
      user: interaction.user.tag,
      estrelas: rating,
      data: new Date(),
    });

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    await interaction.reply({
      content: `Avaliação salva: ${rating} ⭐`,
      flags: 64,
    });
  } catch (error) {
    console.error("Erro ao registrar avaliação:", error);
    await interaction.reply({
      content: "Erro ao registrar avaliação.",
      flags: 64,
    });
  }
}
