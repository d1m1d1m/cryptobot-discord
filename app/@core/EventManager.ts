import { BaseClient } from "discord.js";

export default class EventManager
{
  bot: BaseClient;

  constructor(client : BaseClient) {
    console.log("Event manager is set !");

    this.bot = client;
  }

}