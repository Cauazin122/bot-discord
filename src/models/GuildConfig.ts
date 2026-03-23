import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
  guildId: String,

  antiLink: [String], // canais
  logs: String,       // canal logs
  antispam: Boolean,

  autoMod: {
    mute: Number,
    kick: Number
  },

  warns: {
    type: Map,
    of: [
      {
        reason: String,
        staff: String,
        date: String
      }
    ]
  }
});

export default mongoose.model("GuildConfig", guildSchema);
