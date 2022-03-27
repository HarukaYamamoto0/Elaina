const notifier = require("../plugins/notifier.js");
const { SlashCommandBuilder: builder } = require("@discordjs/builders");

class Command {
  code() {}

  async run(client, interaction, ...rest) {
    try {
      await this.code(client, interaction, ...rest);
    } catch (err) {
      if (interaction.replied) await interaction.deleteReply();
      await notifier(client, "Comando Com Error", err);
      await interaction.reply({
        content:
          "Aconteceu algum error ao tentar excutar o comando, " +
          "Tente reportar usando o comando bugreport",
        ephemeral: true,
      });
    }
  }
}

module.exports = { Command, builder };
