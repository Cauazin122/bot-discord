import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true },
  maxUses: { type: Number, default: null },
  currentUses: { type: Number, default: 0 },
  usedBy: { type: [String], default: [] },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  active: { type: Boolean, default: true }
});

export default mongoose.model('Coupon', couponSchema);
