import mongoose from "mongoose";

const warnSchema = new mongoose.Schema({
  reason: String,
  staff: String,
  date: { type: Date, default: Date.now }
});

const avaliacaoSchema = new mongoose.Schema({
  user: String,
  estrelas: String,
  data: { type: Date, default: Date.now }
});

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true },

  warns: {
    type: Map,
    of: [warnSchema],
    default: {}
  },

  antiLink: {
    type: [String],
    default: []
  },

  logs: {
    type: String,
    default: null
  },

  antiSpam: {
    enabled: { type: Boolean, default: false },
    maxMessages: { type: Number, default: 5 },
    interval: { type: Number, default: 5000 }
  },

  autoMod: {
    mute: { type: Number, default: 3 },
    kick: { type: Number, default: 5 }
  },

  avaliacoes: {
    type: [avaliacaoSchema],
    default: []
  }
});

export default mongoose.model("GuildConfig", guildSchema);
