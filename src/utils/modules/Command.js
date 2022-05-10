const notifier = require("../plugins/notifier.js");
const { SlashCommandBuilder: builder } = require("@discordjs/builders");

class Command {
  code() {}

  async run(client, interaction, ...rest) {
    try {
      await this.code(client, interaction, ...rest);
    } catch (err) {
      await notifier(client, "Comando Com Error", err);

      const message = {
        content:
          "Aconteceu algum error ao tentar excutar o comando, " +
          "Tente reportar usando o comando bugreport",
        ephemeral: true,
      };

      if (interaction.deferred || interaction.replied)
        interaction.followUp(message);
      else interaction.reply(message);
    }
  }
}

module.exports = { Command, builder };
