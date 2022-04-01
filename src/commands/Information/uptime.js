const { Command, builder } = require("../../utils/modules/Command.js");
const { time } = require("@discordjs/builders");

class Uptime extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("uptime")
      .setDescription("Veja a quanto tempo estou acordada");
  }

  async code(client, interaction) {
    await interaction.reply(time(client.readyAt, "R"));
  }
}

module.exports = Uptime;
