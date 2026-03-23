import mongoose from "mongoose";

export async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("🟢 MongoDB conectado");
  } catch (err) {
    console.error("❌ Erro Mongo:", err);
  }
}
