const { Client, Collection } = require("discord.js");
const plugins = require("../utils/main.js");

class Elaina extends Client {
  constructor(options) {
    super(options);
    this.commands = new Collection();
    this.subCommands = new Collection();
    this.Utils = plugins();
  }

  destroy() {
    console.log("O sistema está reiniciando");
    super.destroy();
    process.exit();
  }

  async social() {
    const myInvitation = super.generateInvite({
      scopes: ["bot", "applications.commands"],
    });

    const guild = await this.guilds.fetch(process.env.supportServerId);
    let support = guild.invites.cache.find((i) => i.maxAge === 0);

    if (!support) {
      const randomChannel = guild.channels.cache.find(
        (i) => i.type === "GUILD_TEXT"
      );
      const link = await guild.invites.create(randomChannel.id, { maxAge: 0 });
      support = link;
    }

    return { me: myInvitation, support: support.url };
  }
}

module.exports = { Elaina };
