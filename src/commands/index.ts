import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const commands: Record<string, Command> = {};

// Commands will be imported and added here
