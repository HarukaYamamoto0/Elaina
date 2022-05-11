const { Command, builder } = require("../../utils/modules/Command.js");

class Info extends Command {
  constructor() {
    super();
    this.isSub = true;
    this.ref = "Info";

    this.data = new builder()
      .setName("info")
      .setDescription("Veja informações sobre um usuário ou servidor")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("user")
          .setDescription("Veja informações sobre um usuário")
          .addUserOption((option) =>
            option.setName("user").setDescription("Usuario a ser buscado")
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("server")
          .setDescription("Veja informações sobre um servidor")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("xp")
          .setDescription("veja as informações do xp de um usuário")
          .addUserOption((option) =>
            option.setName("usuario").setDescription("usuario a ser buscado")
          )
      );
  }

  async code(client, interaction) {
    const subCommand = client.subCommands
      .get("Info")
      .get(interaction.options.getSubcommand());

    await subCommand(client, interaction);
  }
}

module.exports = Info;
