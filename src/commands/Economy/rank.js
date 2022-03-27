const { Command, builder } = require("../../utils/modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

class Rank extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("rank")
      .setDescription("Veja o rank de coins");
  }

  async code(client, interaction) {
    const { User } = client.models;
    let scoreboard = "";

    const users = await User.find();
    const rich = users.filter((u) => u.economy.coins > 0);

    if (rich.length === 0)
      return interaction.reply("não há ninguém no placar ainda!");

    const global = rich
      .sort((x, y) => y.economy.coins - x.economy.coins)
      .slice(0, 5);
    const fetch = (id) => client.users.cache.get(id).tag;

    for (const user of global) {
      scoreboard += `> **${fetch(user._id)}**
      > Coins: **${user.economy.coins}** | Level: **${user.exp.level}**\n\n`;
    }

    const embed = new MessageEmbed()
      .setAuthor({ name: "Rank De Coins" })
      .setDescription(stripIndents`${scoreboard}`)
      .setColor(process.env.colorEmbed);

    interaction.reply({
      embeds: [embed],
    });
  }
}

module.exports = Rank;
