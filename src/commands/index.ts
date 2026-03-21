import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import * as ping from "./ping.js";
import * as ajuda from "./help.js";
import * as eco from "./echo.js";
import * as info from "./info.js";
import * as ticket from "./ticket.js";
import * as avaliacoes from "./avaliacoes.js";
import * as top from "./top.js";
import ban from "./ban.js";
import kick from "./kick.js";
import mute from "./mute.js";
import warn from "./warn.js";

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const commands: Record<string, Command> = {
  ping,
  ajuda,
  eco,
  info,
  ticket,
  avaliacoes,
  top,
  ban,
  kick,
  mute,
  warn
};
