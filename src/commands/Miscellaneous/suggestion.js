const { Command, builder } = require("../../utils/modules/Command.js");
const { codeBlock } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

class Suggestion extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("suggestion")
      .setDescription("Envie uma sugestão para o meu desenvolvedor")
      .addStringOption((option) =>
        option
          .setName("sugestao")
          .setDescription("Diga a sua sugestão")
          .setRequired(true)
      );
  }

  async code(client, interaction) {
    const suggestion = interaction.options.getString("sugestao");

    if (suggestion.length < 15 || suggestion.length > 225) {
      return interaction.reply({
        content:
          "A sugestão deve ter pelo menos 15 caracteres, e no máximo 225",
        ephemeral: true,
      });
    }

    const usefulPiece = suggestion.slice(0, 225).replace(/\|`/g, "");
    const user = interaction.user;
    const name = `${user.tag} (${user.id})`;

    const embed = new MessageEmbed()
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField("Autor: ", name)
      .addField("Servidor: ", interaction.guild.name)
      .addField("Sugestão: ", codeBlock("xml", usefulPiece))
      .setColor(process.env.colorEmbed);

    const channel = client.channels.cache.get(process.env.sugChannelId);

    try {
      await channel.send({ embeds: [embed] });
      interaction.reply("A sua sugestão foi enviado com sucesso");
    } catch (e) {
      throw new Error("Suggestion channel not found!");
      interaction.reply(
        "Não foi possível enviar a sugestão por problemas técnicos" +
          "mais tente novamente mais tarde"
      );
    }
  }
}

module.exports = Suggestion;
