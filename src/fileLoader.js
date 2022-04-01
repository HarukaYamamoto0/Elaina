const { Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = {
  //~~~~~~~~~~~~~~~~~~~~~~~LOADCOMMANDS~~~~~~~~~~~~~~~~~~~~~~~//
  async loadCommands(client) {
    const allCommands = [];
    client.commands.clear();
    client.subCommands.clear();

    const folders = await readdirSync("./src/commands/");

    for (const folder of folders) {
      const commands = readdirSync(`./src/commands/${folder}/`).filter((x) =>
        x.endsWith(".js")
      );

      for (const file of commands) {
        const command = new (require(`./commands/${folder}/${file}`))();
        const cmdName = file.split(".")[0];
        command.category = folder;
        
        //~~~~~~~~~~~~~~~~~~~~~~~SUBCOMMANDS~~~~~~~~~~~~~~~~~~~~~~~// 
        if (command.isSub) {
          const fileNames = readdirSync(
            `./src/commands/${folder}/${command.ref}/`
          );
          const subs = new Collection();

          for (const sub of fileNames) {
            const path = `./commands/${folder}/${command.ref}/${sub}`;
            const subCommand = require(path);
            const subName = sub.split(".")[0];

            subs.set(subName, subCommand);
            delete require.cache[require.resolve(path)];
          }

          client.subCommands.set(command.ref, subs);
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 

        client.commands.set(cmdName, command);
        allCommands.push(command.data.toJSON());

        delete require.cache[require.resolve(`./commands/${folder}/${file}`)];
      }
    }

    const rest = new REST({ version: "9" }).setToken(process.env.tokenBot);

    await rest.put(Routes.applicationCommands(process.env.clientId), {
      body: allCommands,
    });

    console.log("[COMMANDS] - todos os comandos foram carregados");
  },
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~~~~~~~LOADEVENTS~~~~~~~~~~~~~~~~~~~~~~~//
  async loadEvents(client) {
    client._events = {};

    const events = await readdirSync("./src/client/events");

    for (const event of events) {
      const file = require(`./client/events/${event}`);
      const eventName = event.split(".")[0];

      if (eventName === "ready") {
        client.once("ready", file.bind(null, client));
      } else {
        client.on(eventName, file.bind(null, client));
      }

      delete require.cache[require.resolve(`./client/events/${event}`)];
    }

    console.log("[EVENTS] - todos os eventos do bot foram carregados");
  },
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
};

//~~~~~~~~~~~~~~~~~~~~~~~LOADALL~~~~~~~~~~~~~~~~~~~~~~~//
module.exports.loadAll = async (client) => {
  await module.exports.loadCommands(client);
  await module.exports.loadEvents(client);
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
