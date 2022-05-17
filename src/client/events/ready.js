module.exports = async (client) => {
  const { Channel } = client.models;

  const channels = await Channel.find({});
  client.youtubeChannels = [...channels];

  client.user.setStatus("idle");
  client.user.setActivity("Sadstation", { type: "LISTENING" });
  console.log(`Logado Em ${client.user.tag}`);
};
