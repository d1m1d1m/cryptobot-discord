import { BaseClient, CacheType, Collection, Events, Interaction, MessageFlags, REST, Routes, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import ora from "ora";
import path from "path";
import { cwd } from "process";

export default class CommandManager
{
  private _bot: BaseClient;
  public collection: Collection<string, {
    data: SlashCommandBuilder,
    execute: (interaction: Interaction) => Promise<any>
  }>;

  constructor(client : BaseClient)
  {
    this._bot = client;
    this.collection = new Collection();

    // Events for handle any commands interaction
    this._bot.on(Events.InteractionCreate, async (interaction : Interaction<CacheType>) => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.collection.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      await command.execute(interaction);
    });
  }

  /**
   *  Stocke les commandes du dossier app/commands
   *  dans une collection instantiée en tant que
   *  propriété.
   */
  public async registerCommandsIntoCollection()
  { 
    const commandsFolderPath = "app/commands";
    const commandsFolder = fs.readdirSync(commandsFolderPath);

    for(const folder of commandsFolder)
    {
      const commandsSubFolderPath = path.join(commandsFolderPath, folder);
      const commandsSubFolder = fs.readdirSync(commandsSubFolderPath);
      
      for (const commandFile of commandsSubFolder)
      {
        const commandFilePath = path.join(commandsSubFolderPath, commandFile);
        const commandModule = (await import(commandFilePath)).default;
        this.collection.set(commandModule.data.name, commandModule);
      }
    }
  }

  /**
   *  Enregistre les commandes via l'API REST
   *  discord.
   */
  public async registerCommandsIntoREST()
  {
    const data = await this._bot.rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      { body: this.collection.map((cmd) => cmd.data.toJSON()) }
    );
  }

  /**
   *  Permet d'initialiser le command manager.
   */
  public async init()
  {
    const spinner = ora("Setting up command manager ...").start();

    await this.registerCommandsIntoCollection();
    await this.registerCommandsIntoREST();

    return spinner;
  }

}