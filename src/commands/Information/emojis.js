const { Command, builder } = require("../../utils/modules/Command.js");
const { stripIndents } = require("common-tags");
const { time } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

class Emojis extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("emojis")
      .setDescription("Veja as informações de um emoji")
      .addStringOption((option) =>
        option
          .setName("emoji")
          .setDescription("Emoji a ser pesquisado")
          .setRequired(true)
      );
  }

  async code(client, interaction) {
    const reg = /:[a-zA-Z_0-9]{1,18}:/g;
    const unresolvedEmoji = interaction.options.getString("emoji");

    if (!reg.test(unresolvedEmoji))
      return interaction.reply({
        content: "Isso não é um emoji válido!\nExemplo: :cafe:",
        ephemeral: true,
      });

    const name = unresolvedEmoji.replace(/:/g, "");
    const allEmojis = await interaction.guild.emojis.fetch();
    const emoji = allEmojis.find((e) => e.name === name);

    if (!emoji)
      return interaction.reply({
        content: "O emoji não foi encontrado no servidor.",
        ephemeral: true,
      });

    let animated;
    if (emoji.animated) animated = "Sim";
    else animated = "Não";

    const description = stripIndents`
    Nome: ***${emoji.name}***
    Id: **${emoji.id}**
    Animado: **${animated}**
    Autor: **${emoji.author.tag}**
    Criado Em: ${time(emoji.createdAt)}
    `;

    const embed = new MessageEmbed()
      .setThumbnail(emoji.url)
      .setDescription(description)
      .setColor(process.env.colorEmbed);

    const row = new MessageActionRow().addComponents(
      new MessageButton().setURL(emoji.url).setLabel("Baixar").setStyle("LINK")
    );

    interaction.reply({
      embeds: [embed],
      components: [row],
    });
  }
}

module.exports = Emojis;
