import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default
{
  data: (
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong !")
  ),

  execute: async (interaction : ChatInputCommandInteraction) => {
    const start = Date.now();

    await interaction.reply("Pinging...");

    const end = Date.now();
    const botLatency = end - start;
    
    const apiLatency = Math.round(interaction.client.ws.ping);

    await interaction.editReply(
      `🏓 Pong!\nBOT Latency: ${botLatency} ms\nAPI Latency: ${apiLatency} ms`
    );
  }
};