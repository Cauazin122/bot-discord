import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },

  warns: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
