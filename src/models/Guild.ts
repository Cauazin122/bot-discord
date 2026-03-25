import mongoose from 'mongoose';

const warnSchema = new mongoose.Schema({
  userId: String,
  reason: String,
  staff: String,
  date: { type: Date, default: Date.now }
});

const ratingSchema = new mongoose.Schema({
  userId: String,
  stars: Number,
  feedback: String,
  date: { type: Date, default: Date.now }
});

// ✅ NOVO SCHEMA
const violationSchema = new mongoose.Schema({
  userId: String,
  type: String, // ex: "spam", "link", "palavra_proibida"
  count: { type: Number, default: 1 },
  lastViolation: { type: Date, default: Date.now }
});

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },

  // Channels
  logChannel: String,
  antiLinkChannel: String,
  ticketCategory: String,
  transcriptChannel: String,

  // Features
  antiSpamEnabled: { type: Boolean, default: false },
  antiLinkEnabled: { type: Boolean, default: false },

  // AutoMod
  autoMod: {
    muteAt: { type: Number, default: 3 },
    kickAt: { type: Number, default: 5 }
  },

  // Staff roles
  staffRoles: [String],

  // Data
  warns: [warnSchema],
  ratings: [ratingSchema],

  // ✅ NOVO CAMPO
  violations: [violationSchema],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Guild', guildSchema);
