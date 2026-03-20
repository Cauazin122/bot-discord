import { ButtonInteraction } from "discord.js";
import { handleCloseTicketInteraction } from "./closeTicketCreate.js";

export async function handleButtonInteraction(interaction: ButtonInteraction) {
  if (interaction.customId === "close_ticket") {
    await handleCloseTicketInteraction(interaction);
  }
}
