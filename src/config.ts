export const TICKET_TYPES = {
  suporte: { label: "Suporte", emoji: "🛠️" },
  denuncia: { label: "Denúncia", emoji: "🚨" },
  duvida: { label: "Dúvida", emoji: "❓" },
};

interface GuildConfig {
  STAFF_ROLES: string[];
  CATEGORY_ID: string;
  LOG_CHANNEL: string;
  TRANSCRIPT_CHANNEL: string;
}

const GUILD_CONFIGS: Record<string, GuildConfig> = {
  // Configuração padrão via env vars
  default: {
    STAFF_ROLES: (process.env.STAFF_ROLE_ID || "").split(",").filter(Boolean),
    CATEGORY_ID: process.env.TICKET_CATEGORY_ID || "",
    LOG_CHANNEL: process.env.LOG_CHANNEL_ID || "",
    TRANSCRIPT_CHANNEL: process.env.LOG_CHANNEL_ID || "",
  },
  // Servidor de testes (usa LOG_CHANNEL como transcript)
  "1074821077303304292": {
    STAFF_ROLES: ["1107467847061471333"],
    CATEGORY_ID: "1483282512716369941",
    LOG_CHANNEL: "1463602167460921547",
    TRANSCRIPT_CHANNEL: "1463602167460921547",
  },
  // Novo servidor (transcript vai para canal fixo)
  "1475319429322510418": {
    STAFF_ROLES: [
      "1476935666217648210",
      "1476936237423267850",
      "1476935034676969614",
    ],
    CATEGORY_ID: "1483291371782537287",
    LOG_CHANNEL: "1483071071627378718",
    TRANSCRIPT_CHANNEL: "1483071071627378718",
  },
};

export function getGuildConfig(guildId: string): GuildConfig {
  return GUILD_CONFIGS[guildId] || GUILD_CONFIGS["default"];
}

// Compatibilidade retroativa
export const config = {
  STAFF_ROLE: process.env.STAFF_ROLE_ID || "",
  CATEGORY_ID: process.env.TICKET_CATEGORY_ID || "",
  LOG_CHANNEL: process.env.LOG_CHANNEL_ID || "",
};
