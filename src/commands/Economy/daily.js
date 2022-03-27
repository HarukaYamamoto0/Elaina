const { Command, builder } = require("../../utils/modules/Command.js");
const { getter } = require("../../utils/modules/emojis.js");

class Daily extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("daily")
      .setDescription("Resgate o seu prêmio diário");
  }

  async code(client, interaction, { user }) {
    const { backIn } = client.Utils;
    const { User } = client.models;
    const Emojis = new getter(client);

    const millisecondsFromLastRescue = user.cooldowns.daily;
    const dayInMilliseconds = 86400000;
    const now = Date.now();
    const cooldown = dayInMilliseconds - (now - millisecondsFromLastRescue);

    if (cooldown > 0 && millisecondsFromLastRescue !== 0) {
      return interaction.reply(
        `${Emojis.get("wrong")}│Volte em ${backIn(new Date(cooldown))}`
      );
    }

    const coins = Math.floor(Math.random() * 700) + 1200;
    await User.findByIdAndUpdate(user._id, {
      "economy.coins": coins + user.economy.coins,
      "cooldowns.daily": Date.now(),
    });

    interaction.reply(
      `${Emojis.get("money")}│Parabéns hoje você ganhou **${coins}** coins`
    );
  }
}

module.exports = Daily;
