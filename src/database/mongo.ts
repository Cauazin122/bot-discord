import mongoose from "mongoose";

export async function connectMongo() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI não definida");
    }

    console.log("🔄 Conectando ao MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // evita travar 10s
    });

    console.log("✅ MongoDB conectado com sucesso!");
  } catch (err) {
    console.error("❌ Erro Mongo:", err);
    process.exit(1); // 🔥 impede o bot de rodar quebrado
  }
}
