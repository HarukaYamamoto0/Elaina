module.exports = async (client, interaction) => {
  const { user: author, guild } = interaction;
  const { User, Guild } = client.models;

  //~~~~~~~~~~~~~~~~IF THEY DO NOT EXIST~~~~~~~~~~~~~~~~~~~//
  let server = await Guild.findById(guild.id);
  let user = await User.findById(author.id);

  try {
    if (!server) {
      const serverD = await Guild.create({ _id: guild.id });
      server = serverD;
    }

    if (!user) {
      const userD = await User.create({ _id: author.id });
      user = userD;
    }
  } catch (err) {
    client.Utils.notifier(client, "Database Error", err);
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~~~~~XP SYSTEM~~~~~~~~~~~~~~~~~~~~~~~//
  const { xp, level, nextLevel } = user.exp;
  const newXp = Math.floor(Math.random() * 8) + 1;

  await User.findByIdAndUpdate(author.id, {
    "exp.xp": xp + newXp,
  });

  if (xp >= nextLevel) {
    await User.findByIdAndUpdate(author.id, {
      "exp.xp": 0,
      "exp.level": level + 1,
      "exp.nextLevel": nextLevel * level,
    });
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~~IF IT IS A COMMAND~~~~~~~~~~~~~~~~~//
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await command.run(client, interaction, { user, server });
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
};
