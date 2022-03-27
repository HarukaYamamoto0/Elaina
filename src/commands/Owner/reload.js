/* eslint-disable max-len */

const { Command, builder } = require("../../utils/modules/Command.js");
const { getter } = require("../../utils/modules/emojis.js");

class Reload extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("reload")
      .setDescription("Recarregue um comando")
      .addStringOption((option) =>
        option
          .setName("comando")
          .setDescription("Nome do comando")
          .setRequired(true)
      );
  }

  async code(client, interaction) {
    if (interaction.user.id !== process.env.ownerId)
      return interaction.reply({
        content: "Você não tem permissão de executar esse comando!",
        ephemeral: true,
      });
    
    const commandName = interaction.options.getString("comando");
    const command = client.commands.get(commandName);
    const Emojis = new getter(client);

    if (!command)
      return interaction.reply(
        `${Emojis.get("wrong")}│O comando __**${
          commandName
        }**__ não foi encontrado!`
      );

    const path = `../../commands/${command.category}/${commandName}`;

    try {
      delete require.cache[require.resolve(path)];
      client.commands.delete(commandName);

      const newCommand = new (require(path))();
      newCommand.category = command.category;
      client.commands.set(commandName, newCommand);

      interaction.reply(
        `${Emojis.get("right")}│O comando **${
          commandName
        }** foi recarregado com sucesso!`
      );
    } catch (err) {
      console.log(err);
      interaction.reply({
        content: err.message,
        ephemeral: true,
      });
    }
  }
}

module.exports = Reload;
