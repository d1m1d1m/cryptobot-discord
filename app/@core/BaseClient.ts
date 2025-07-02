import { Client, ClientOptions, Events, REST, Routes } from "discord.js";

import CommandManager from "./CommandManager";
import EventManager from "./EventManager";

export default class BaseClient extends Client
{
  public CommandManager : CommandManager;
  // public EventManager : EventManager;

  constructor(options : ClientOptions) {
    super(options);

    this.token = process.env.DISCORD_BOT_TOKEN;
    this.rest.setToken(this.token);

    this.CommandManager = new CommandManager(this);

    this.once(Events.ClientReady, async () => {
      this.CommandManager.init()
      .then((spinner) => {
        spinner.stopAndPersist({
          symbol: ">",
          suffixText: "✅",
          text: "Command manager",
        })
      });
    });
  }

}