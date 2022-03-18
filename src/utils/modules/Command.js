const notifier = require("../plugins/notifier.js");
const { SlashCommandBuilder: builder } = require("@discordjs/builders");

class Command {
  code() {}

  async run(client, interaction) {
    try {
      await this.code(client, interaction);
    } catch (err) {
      await interaction.reply({
        content:
          "Aconteceu algum error ao tentar excutar o comando, " +
          "Tente reportar usando o comando bugreport",
        ephemeral: true,
      });
      await notifier(client, "Comando Com Error", err);
    }
  }
}

module.exports = { Command, builder };
