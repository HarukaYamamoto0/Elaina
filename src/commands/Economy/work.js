const { Command, builder } = require("../../utils/modules/Command.js");
const { getter } = require("../../utils/modules/emojis.js");

class Daily extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("work")
      .setDescription("Trabalhe e receba recompensas");
  }

  async code(client, interaction, { user }) {
    const { backIn } = client.Utils;
    const { User } = client.models;
    const Emojis = new getter(client);

    const millisecondsFromLastJob = user.cooldowns.work;
    const hourInMilliseconds = 21600000; // 6 horas
    const now = Date.now();
    const cooldown = hourInMilliseconds - (now - millisecondsFromLastJob);

    if (cooldown > 0 && millisecondsFromLastJob !== 0) {
      return interaction.reply(
        `${Emojis.get("wrong")}│Volte em ${backIn(new Date(cooldown))}`
      );
    }

    const coins = Math.floor(Math.random() * 700) + 1200;
    await User.findByIdAndUpdate(user._id, {
      "economy.coins": coins + user.economy.coins,
      "cooldowns.work": Date.now(),
    });

    interaction.reply(
      `${Emojis.get("money")}│Como pagamento você ganhou **${coins}** coins`
    );
  }
}

module.exports = Daily;
