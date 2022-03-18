module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  else command.run(client, interaction);
};
