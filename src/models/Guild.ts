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

const faqCooldownSchema = new mongoose.Schema({
  userId: String,
  lastFaqTime: { type: Date, default: Date.now }
});

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },

  // Channels
  logChannel: String,
  ratingsChannel: String,
  ticketCategory: String,
  transcriptChannel: String,
  faqChannel: String,

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

  // Taxa de conversão Robux → Real
  taxaRobux: { type: Number, default: 0.05 },
  margemVenda: { type: Number, default: 1.30 },

  // Customer roles (XP system)
  customerRoles: {
    firstPurchase: String,
    tier1500: String,
    tier2000: String,
    tier2500: String,
    tier3000: String,
    tier3500: String,
    tier4000: String,
    tier5000: String,
    tier6000: String,
    tier7000: String,
    tier10000: String,
    tier15000: String,
    tier20000: String,
    tier100000: String
  },

  // FAQ Cooldowns
  faqCooldowns: [faqCooldownSchema],

  // Data
  warns: [warnSchema],
  ratings: [ratingSchema],
  violations: [violationSchema],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Guild', guildSchema);
