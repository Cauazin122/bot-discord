import mongoose from "mongoose";

const warnSchema = new mongoose.Schema({
  reason: String,
  staff: String,
  date: Date
});

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },

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
  }
});

export default mongoose.model("GuildConfig", guildSchema);
