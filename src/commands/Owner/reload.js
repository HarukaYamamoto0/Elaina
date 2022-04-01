const { Command, builder } = require("../../utils/modules/Command.js");

class Reload extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("reload")
      .setDescription("Recarregue todos os comandos ou eventos")
      .addStringOption((option) =>
        option
          .setName("tipo")
          .setDescription("Se e os comandos ou eventos")
          .setRequired(true)
          .addChoice("comandos", "command")
          .addChoice("eventos", "event")
          .addChoice("todos", "all")
      );
  }

  async code(client, interaction) {
    if (interaction.user.id !== process.env.ownerId)
      return interaction.reply({
        content: "Você não tem permissão de executar esse comando!",
        ephemeral: true,
      });

    const type = interaction.options.getString("tipo");
    const fileLoader = require("../../fileLoader.js");

    if (type === "all") {
      await fileLoader.loadAll(client);
      interaction.reply({
        content: "Todos os comandos e eventos foram recarregados.",
        ephemeral: true,
      });
    } else if (type === "command") {
      await fileLoader.loadCommands(client);
      interaction.reply({
        content: "Todos os comandos foram recarregados.",
        ephemeral: true,
      });
    } else {
      await fileLoader.loadEvents(client);
      interaction.reply({
        content: "Todos os eventos foram recarregados.",
        ephemeral: true,
      });
    }
  }
}

module.exports = Reload;
