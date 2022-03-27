const { Command, builder } = require("../../utils/modules/Command.js");
const { codeBlock } = require("@discordjs/builders");
const { getter } = require("../../utils/modules/emojis");
const { readdirSync } = require("fs");
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

class Help extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("help")
      .setDescription("Abra o painel de ajuda")
      .addStringOption((option) =>
        option
          .setName("comando")
          .setDescription("Comando individual a ser procurado")
      );
  }

  async code(client, interaction) {
    const Emojis = new getter(client);

    const oneCommand = interaction.options.getString("comando");
    
    if (oneCommand) {
      const command = client.commands.get(oneCommand);
      if (!command) 
        return interaction.reply({
          content: "Comando não encontrado!",
          ephemeral: true,
        });
      
      const { name, description } = command.data;
      
      const embed = new MessageEmbed()
        .setTitle(name)
        .setThumbnail(Emojis.get("Information").url)
        .setDescription(description)
        .setColor(process.env.colorEmbed);
      
      return interaction.reply({ embeds: [embed] });
    }

    const commands = client.commands.map((cmd) => cmd);
    const categoryNames = await readdirSync("./src/commands/");
    const categories = {};
    const embeds = {};

    for (const command of commands) {
      const {
        category,
        data: { name },
      } = command;
      categories[category] = categories[category] || [];
      categories[category].push(name);
    }

    for (const category in categories) {
      const embed = new MessageEmbed()
        .setAuthor({ name: category, iconURL: Emojis.get(category).url })
        .setDescription(`Todos os comandos da categoria de ${category}`)
        .setColor(process.env.colorEmbed);

      embed.addField(
        "Comandos",
        codeBlock(categories[category].sort().join(" ~ "))
      );
      embeds[category] = embed;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~Main Part~~~~~~~~~~~~~~~~~~~~~//
    const description =
      `Muito prazer, o meu nome é ${client.user.username}, sou apenas uma ` +
      "simples bot em slash com vários comandos legais e divertidos.";

    const mainEmbed = new MessageEmbed()
      .setAuthor({
        name: `${client.user.username} commands`,
        iconURL: Emojis.get("home").url,
      })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(description)
      .setColor(process.env.colorEmbed);

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("HELP_MENU")
        .setPlaceholder("Selecione uma categoria")
        .addOptions([
          {
            label: "Página Principal",
            description: "Volte para a página principal",
            value: "home",
            emoji: Emojis.get("home"),
          },
          ...categoryNames.map((c) => {
            return {
              label: c,
              description: `Aqui tem ${categories[c].length} comandos`,
              value: c,
              emoji: Emojis.get(c),
            };
          }),
        ])
    );

    const msg = await interaction.reply({
      embeds: [mainEmbed],
      components: [row],
      fetchReply: true,
    });

    //~~~~~~~~~~~~~~~~~~~~~~~Collector~~~~~~~~~~~~~~~~~~~~~//
    const collector = interaction.channel.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      time: 120000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({
          content: "Apenas quem executou o comando pode usar ele",
          ephemeral: true,
        });
      }
      const chosenCategory = i.values[0];
      await msg.edit({
        embeds: [embeds[chosenCategory] || mainEmbed],
        components: [row],
      });
    });

    collector.on("end", async () => {
      await msg
        .edit({
          embeds: [mainEmbed],
          components: [],
        })
        .catch((o_O) => o_O);
    });
  }
}

module.exports = Help;
