import dotenvx from '@dotenvx/dotenvx';
import {
  GatewayIntentBits,
} from "discord.js";
import BaseClient from "./@core/BaseClient";

dotenvx.config({ quiet: true });

/* ===== INSTANCE ====== */
const client = new BaseClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.login();