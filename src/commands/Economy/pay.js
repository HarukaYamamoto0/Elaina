const { Command, builder } = require("../../utils/modules/Command.js");
const { MessageButton, MessageActionRow } = require("discord.js");

class Pay extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("pay")
      .setDescription("Envie dinheiro para outro usuário")
      .addUserOption((option) =>
        option
          .setName("usuario")
          .setDescription("Usuario que vai receber a transferência")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("quantidade")
          .setDescription("Quantidade a ser enviada")
          .setRequired(true)
      );
  }

  async code(client, interaction, { user }) {
    const { User } = client.models;
    const sender = interaction.options.getUser("usuario");
    const amount = interaction.options.getInteger("quantidade");
    
    const error = (text) =>
      interaction.reply({ content: text, ephemeral: true });

    if (sender.id === interaction.user.id) {
      return error("Você não pode enviar para você mesmo!");
    } else if (amount < 50) {
      return error("Você não pode enviar menos de **70** coins!");
    } else if (amount > user.economy.coins) {
      return error("Você não tem todo esse dinheiro!");
    }

    const userDoc = await User.findById(sender.id);
    if (!userDoc)
      return error("Esse usuário ainda não está na minha database!");

    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId("PAY_YES")
        .setLabel("Sim")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId("PAY_NO")
        .setLabel("Não")
        .setStyle("DANGER"),
    ]);

    const msg = await interaction.reply({
      content: `Você tem a **máxima** certeza que você quer enviar **${
        amount
      }** coins para ${sender.tag}?`,
      fetchReply: true,
      components: [row],
    });

    const collector = msg.channel.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({
          content: "Apenas quem executou o comando pode usar ele",
          ephemeral: true,
        });
      }

      if (i.customId === "PAY_YES") {
        await User.findByIdAndUpdate(sender.id, {
          "economy.coins": userDoc.economy.coins + amount,
        });

        await User.findByIdAndUpdate(interaction.user.id, {
          "economy.coins": user.economy.coins - amount,
        });

        await msg.edit({
          content: "Transferência realizada com sucesso!",
          components: [],
        });
      } else if (i.customId === "PAY_NO") {
        await msg.edit({
          content: "Transferência cancelada com sucesso!",
          components: [],
        });
      }
    });

    collector.on("end", async () => {
      await msg
        .edit({
          content: "Tempo de Interação Acabado",
          components: [],
        })
        .catch((o_O) => o_O);
    });
  }
}

module.exports = Pay;
