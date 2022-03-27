/* eslint-disable no-unused-vars */

const { Command, builder } = require("../../utils/modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { inspect } = require("util");

class Eval extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("eval")
      .setDescription("Execute comandos")
      .addStringOption((option) =>
        option
          .setName("comando")
          .setDescription("O comando a ser executado")
          .setRequired(true)
      );
  }

  async code(client, interaction, { user, server }) {
    const { user: author, guild } = interaction;

    if (author.id !== process.env.ownerId)
      return interaction.reply({
        content: "Você não tem permissão de executar esse comando!",
        ephemeral: true,
      });

    const code = interaction.options.getString("comando");
    let result = "nada";
    let type = {};

    try {
      result = type = eval(code);
    } catch (err) {
      result = err.message;
      console.log(err.stack);
    }

    if (typeof result !== "string") result = inspect(result, { depth: 0 });
    if (result.length >= 1002) result = result.slice(0, 1002) + "...";

    const embed = new MessageEmbed()
      .addField(":keyboard: Entrada: ", codeBlock("js", code))
      .addField(":outbox_tray: Saida: ", codeBlock("js", result))
      .addField(":mag: Tipo de Saída: ", codeBlock("js", typeof type))
      .setColor(process.env.colorEmbed);

    interaction.reply({
      embeds: [embed],
    });
  }
}

module.exports = Eval;
