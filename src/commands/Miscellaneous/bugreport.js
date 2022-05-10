const { Command, builder } = require("../../utils/modules/Command.js");
const { codeBlock } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

class Bugreport extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("bugreport")
      .setDescription("Reporte um bug para o meu desenvolvedor")
      .addStringOption((option) =>
        option
          .setName("bug")
          .setDescription("Descrição do bug")
          .setRequired(true)
      );
  }

  async code(client, interaction) {
    const description = interaction.options.getString("bug");

    if (description.length < 15 || description.length > 1000) {
      return interaction.reply({
        content:
          "A descrição deve ter pelo menos 15 caracteres, e no máximo 1000",
        ephemeral: true,
      });
    }

    const usefulPiece = description.slice(0, 225).replace(/\|`/g, "");
    const user = interaction.user;
    const name = `${user.tag} (${user.id})`;

    const embed = new MessageEmbed()
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField("Autor: ", name)
      .addField("Servidor: ", interaction.guild.name)
      .addField("Descrição: ", codeBlock("xml", usefulPiece))
      .setColor(process.env.colorEmbed);

    const channel = client.channels.cache.get(process.env.bugChannelId);

    try {
      await channel.send({ embeds: [embed] });
      interaction.reply("O bug foi enviado com sucesso");
    } catch (e) {
      throw new Error("Bugreport channel not found!");
      interaction.reply(
        "Não foi possível reportar o bug por problemas técnicos" +
        "mais tente novamente mais tarde"
      );
    }
  }
}

module.exports = Bugreport;
