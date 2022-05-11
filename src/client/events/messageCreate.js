module.exports = async (client, message) => {
  if (!message.guild) return;
  const { author, guild } = message;
  const { User, Guild } = client.models;

  //~~~~~~~~~~~~~~~~IF THEY DO NOT EXIST~~~~~~~~~~~~~~~~~~~//
  let serverDoc = await Guild.findById(guild.id);
  let userDoc = await User.findById(author.id);

  try {
    if (!serverDoc) {
      const newServer = await Guild.create({ _id: guild.id });
      serverDoc = newServer;
    }

    if (!userDoc) {
      const newUser = await User.create({ _id: author.id });
      userDoc = newUser;
    }
  } catch (error) {
    client.Utils.notifier(client, "Database Error", error);
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  const { xpGenerator } = client.Utils;
  await xpGenerator(client, author.id);

  //~~~~~~~~~~~~~~~~~~~MENTION SYSTEM~~~~~~~~~~~~~~~~~~~~//
  if (message.content === `<@${client.user.id}>`) {
    const botInfo = client.commands.get("botinfo");
    return botInfo.run(client, message);
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
};
