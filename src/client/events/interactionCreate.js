module.exports = async (client, interaction) => {
  if (!interaction.guild) return interaction.reply("¯\\_(ツ)_/¯");
  const { user, guild } = interaction;
  const { User, Guild, Blacklist } = client.models;

  //~~~~~~~~~~~~~~~~IF THEY DO NOT EXIST~~~~~~~~~~~~~~~~~~~//
  let serverDoc = await Guild.findById(guild.id);
  let userDoc = await User.findById(user.id);

  try {
    if (!serverDoc) {
      const newServer = await Guild.create({ _id: guild.id });
      serverDoc = newServer;
    }

    if (!userDoc) {
      const newUser = await User.create({ _id: user.id });
      userDoc = newUser;
    }
  } catch (error) {
    client.Utils.notifier(client, "Database Error", error);
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~~~~~XP SYSTEM~~~~~~~~~~~~~~~~~~~~~~~//
  const { xp, level, nextLevel } = userDoc.exp;
  const newXp = Math.floor(Math.random() * 8) + 1;

  await User.findByIdAndUpdate(user.id, {
    "exp.xp": xp + newXp,
  });

  if (xp >= nextLevel) {
    await User.findByIdAndUpdate(user.id, {
      "exp.xp": 0,
      "exp.level": level + 1,
      "exp.nextLevel": nextLevel * level,
    });
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~BLACKLIST SYSTEM~~~~~~~~~~~~~~~~~~~~//
  const banned = await Blacklist.findById(user.id);
  if (banned)
    return interaction.reply({
      content: "Você está na minha blacklist!",
      ephemeral: true,
    });
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~~IF IT IS A COMMAND~~~~~~~~~~~~~~~~~//
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.reply("Comando indisponível.");

    if (command.category === "Owner" && user.id !== process.env.ownerId)
      return interaction.reply({
        content: "Comando indisponível.",
        ephemeral: true,
      });

    await command.run(client, interaction, { userDoc, serverDoc });
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
};
