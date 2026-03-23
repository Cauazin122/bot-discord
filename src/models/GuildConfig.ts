import mongoose from "mongoose";

const warnSchema = new mongoose.Schema({
  reason: String,
  staff: String,
  date: String
});

const avaliacaoSchema = new mongoose.Schema({
  userId: String,
  nota: Number,
  comentario: String,
  staff: String,
  date: String
});

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },

  antiLink: { type: [String], default: [] },
  logs: { type: String, default: null },
  antiSpam: { type: Boolean, default: false },

  autoMod: {
    mute: { type: Number, default: 3 },
    kick: { type: Number, default: 5 }
  },

  warns: {
    type: Map,
    of: [warnSchema],
    default: {}
  },

  avaliacoes: {
    type: [avaliacaoSchema],
    default: []
  }
});

export default mongoose.model("GuildConfig", guildSchema);
