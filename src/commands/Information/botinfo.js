const { Command, builder } = require("../../utils/modules/Command.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

class Botinfo extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("botinfo")
      .setDescription("Veja informações sobre mim");
  }

  async code(client, interaction) {
    const author = interaction.user || interaction.author;
    const owner = await client.users.fetch(process.env.ownerId);
    const avatar = client.user.displayAvatarURL({ dynamic: true });

    const description =
      `Olá ${author} muito prazer, o meu nome é ${client.user.username}, ` +
      "sou apenas uma simples bot em slash com vários comando " +
      `legais e divertidos.\n\nMeu Criador: ***${owner.tag}***`;

    const embed = new MessageEmbed()
      .setThumbnail(avatar)
      .setDescription(description)
      .setColor(process.env.colorEmbed);

    const links = await client.social();
    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setURL(links.support)
        .setLabel("Suporte")
        .setStyle("LINK"),
      new MessageButton()
        .setURL(links.me)
        .setLabel("Me Convide")
        .setStyle("LINK"),
    ]);

    interaction.reply({
      embeds: [embed],
      components: [row],
    });
  }
}

module.exports = Botinfo;
