const { Command, builder } = require("../../utils/modules/Command.js");
const { getter } = require("../../utils/modules/emojis.js");

class Atm extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("atm")
      .setDescription("Veja o status da sua economia")
      .addUserOption((option) =>
        option.setName("usuario").setDescription("Selecione um usuário")
      );
  }

  async code(client, interaction) {
    const author = interaction.options.getUser("usuario") || interaction.user;
    const user = await client.models.User.findById(author.id);
    const Emojis = new getter(client);

    if (!user)
      return interaction.reply(
        `${Emojis.get("wrong")}│Esse usuário ainda não está na minha database!`
      );

    if (author.id === interaction.user.id) {
      interaction.reply(`:dollar:│Você tem **${user.economy.coins}** coins`);
    } else {
      interaction.reply(
        `:dollar:│O usuário **${author.tag}** ` +
        `tem no total **${user.economy.coins}** coins`
      );
    }
  }
}

module.exports = Atm;
