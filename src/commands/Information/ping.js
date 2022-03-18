const { Command, builder } = require("../../utils/modules/Command.js");

class Ping extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("ping")
      .setDescription("Veja o meu ping");
  }

  async code(client, interaction) {
    await interaction.reply(`${client.ws.ping}ms`);
  }
}

module.exports = Ping;
