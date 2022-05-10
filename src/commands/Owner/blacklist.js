const { Command, builder } = require("../../utils/modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { bannedChannelId } = process.env;

class Blacklist extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("blacklist")
      .setDescription("coloque um usuário na minha blacklist")
      .addStringOption((option) =>
        option.setName("id").setDescription("id do usuário").setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("motivo").setDescription("motivo")
      );
  }

  async code(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.options.getString("id");
    const reason = interaction.options.getString("motivo") || "Não definido";
    const user = await client.users.fetch(id);

    if (!user) interaction.editReply("Esse usuário não existe!");
    else if ([process.env.ownerId, client.user.id].includes(id)) {
      return interaction.editReply("Impossível no momento!");
    }

    const Black = client.models.Blacklist;
    const userDoc = await Black.findById(id);

    if (userDoc) {
      await Black.deleteOne({ _id: id });
      await embedMaker(false);
      await interaction.editReply(
        "O usuário foi **retirado** da blacklist com sucesso!"
      );
    } else {
      await Black.create({ _id: id, reason });
      await embedMaker(true);
      await interaction.editReply(
        "O usuário foi **colocado** na minha blacklist com sucesso!"
      );
    }

    async function embedMaker(bool) {
      const iconURL = user.displayAvatarURL({ dynamic: true });
      const isBanned = bool ? "banido" : "desbanido";
      const color = bool ? "#FF0000" : "#5271FF";

      const embed = new MessageEmbed()
        .setThumbnail(iconURL)
        .addFields([
          {
            name: "Autor: ",
            value: interaction.user.tag,
          },
          {
            name: "Usuário: ",
            value: `${user.tag} (${user.id})`,
          },
          {
            name: "Motivo",
            value: codeBlock(
              `O usuário ${user.tag} foi ${isBanned} pelo motivo: ${reason}`
            ),
          },
        ])
        .setColor(color)
        .setTimestamp();

      const channel = await client.channels.fetch(bannedChannelId);
      if (channel) await channel.send({ embeds: [embed] });
      else throw new Error("Banned channel not found!");
    }
  }
}

module.exports = Blacklist;
