const { Command, builder } = require("../../utils/modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");

class Banner extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("banner")
      .setDescription("Veja o banner de alguém")
      .addUserOption((option) =>
        option.setName("usuario").setDescription("Selecione um usuário")
      );
  }

  async code(client, interaction) {
    const user = interaction.options.getUser("usuario") || interaction.user;
    const banner = await client.users.fetch(user.id, {
      cache: false,
      force: true,
    });

    if (!banner || typeof banner !== "string")
      return interaction.reply("Banner não encontrado!");

    const embed = new MessageEmbed()
      .setImage(banner)
      .setTimestamp()
      .setFooter({ text: user.tag })
      .setColor(process.env.colorEmbed);

    const row = new MessageActionRow().addComponents(
      new MessageButton().setURL(banner).setLabel("Baixar").setStyle("LINK")
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
}

module.exports = Banner;
