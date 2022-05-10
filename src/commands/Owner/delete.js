const { Command, builder } = require("../../utils/modules/Command.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fileLoader = require("../../fileLoader");

class Delete extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("delete")
      .setDescription("Deleta um comando de barra")
      .addStringOption((option) =>
        option
          .setName("comando")
          .setDescription("Nome do comando a ser deletado")
          .setRequired(true)
      );
  }

  async code(client, interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    const { tokenBot, clientId } = process.env;
    const commandName = interaction.options.getString("comando");
    const rest = new REST({ version: "9" }).setToken(tokenBot);

    const commands = await rest.get(Routes.applicationCommands(clientId));
    const command = commands.filter((cmd) => cmd.name === commandName)[0];
    
    if (!command)
      return interaction.editReply({
        content: `O comando **${commandName}** não foi encontrado!`,
        ephemeral: true
      });

    const link = `${Routes.applicationCommands(clientId)}/${command.id}`;
    await rest.delete(link);
    await fileLoader.loadCommands(client);
    
    await interaction.editReply({
      content: `O comando **${commandName}** foi excluído com sucesso.`,
      ephemeral: true
    });
  }
}

module.exports = Delete;
