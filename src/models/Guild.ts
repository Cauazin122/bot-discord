import mongoose from 'mongoose';

const warnSchema = new mongoose.Schema({
  userId: String,
  reason: String,
  staff: String,
  date: { type: Date, default: Date.now }
});

const ratingSchema = new mongoose.Schema({
  userId: String,
  staffId: String,
  staffTag: String,
  stars: Number,
  feedback: String,
  date: { type: Date, default: Date.now }
});

const violationSchema = new mongoose.Schema({
  userId: String,
  type: String,
  count: { type: Number, default: 1 },
  lastViolation: { type: Date, default: Date.now }
});

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },

  // Channels
  logChannel: String,
  ratingsChannel: String,
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
  violations: [violationSchema],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Guild', guildSchema);
