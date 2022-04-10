/* eslint-disable */
const { Command, builder } = require("../../utils/modules/Command.js");

class Delete extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("delete")
      .setDescription("Deleta um comando de barra");
  }

  async code(client, interaction) {
    // command to delete other slash commands, in case I did something wrong
  }
}

module.exports = Delete;
