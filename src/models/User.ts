import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },

  // Warns system
  warns: { type: Number, default: 0 },

  // Rating system
  totalRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },

  // XP/Robux system
  totalRobux: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
