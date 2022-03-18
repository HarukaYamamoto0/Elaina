const { Command, builder } = require("../../utils/modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");

class Ping extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("avatar")
      .setDescription("Veja o avatar de alguém")
      .addUserOption((option) =>
        option
          .setName("usuario")
          .setDescription("Selecione o usuário")
          .setRequired(true)
      );
  }

  async code(client, interaction) {
    const user = interaction.options.getUser("usuario");
    const avatar = user.displayAvatarURL({ dynamic: true, size: 2048 });

    const embed = new MessageEmbed()
      .setImage(avatar)
      .setTimestamp()
      .setFooter({ text: user.tag })
      .setColor(process.env.colorEmbed);

    const row = new MessageActionRow().addComponents(
      new MessageButton().setURL(avatar).setLabel("Baixar").setStyle("LINK")
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
}

module.exports = Ping;
