const { Command, builder } = require("../../utils/modules/Command.js");
const { codeBlock } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

class Suggestion extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("suggestion")
      .setDescription("Envie uma sugestao para o meu desenvolvedor")
      .addStringOption((option) =>
        option
          .setName("sugestao")
          .setDescription("A sugestao a ser enviada")
          .setRequired(true)
      );
  }

  async code(client, interaction) {
    const suggestion = interaction.options.getString("sugestao");

    if (suggestion.length < 15 || suggestion.length > 125)
      interaction.reply({
        content:
          "A sugestão deve ter pelo menos 15 caracteres, e no máximo 125",
        ephemeral: true,
      });

    const usefulPiece = suggestion.slice(0, 225).replace(/\|`/g, "");
    const embed = new MessageEmbed()
      .addField("Autor: ", interaction.user.toString())
      .addField("Servidor: ", interaction.guild.name)
      .addField("Sugestão: ", codeBlock("xml", usefulPiece))
      .setColor(process.env.colorEmbed);

    interaction.reply({
      embeds: [embed],
    });
  }
}

module.exports = Suggestion;
