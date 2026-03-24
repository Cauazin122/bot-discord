import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import ping from "./ping.js";
import * as help from "./ajuda.js";
import eco from "./echo.js";
import info from "./info.js";
import ticket from "./ticket.js";
import avaliacoes from "./avaliacoes.js";
import top from "./top.js";
import ban from "./ban.js";
import kick from "./kick.js";
import mute from "./mute.js";
import warn from "./warn.js";
import * as helpadm from "./helpadm.js";
import removewarn from "./removewarn.js";
import warns from "./warns.js";
import antilink from "./antilink.js";
import config from "./config.js";

export const commands = {
  ping,
  help,
  eco,
  info,
  ticket,
  avaliacoes,
  top,
  ban,
  kick,
  mute,
  warn,
  helpadm,
  removewarn,
  warns,
  antilink,
  config
};
