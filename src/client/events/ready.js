module.exports = (client) => {
  client.user.setStatus("idle");
  client.user.setActivity("Sadstation", { type: "LISTENING" });

  console.log(`Logado Em ${client.user.tag}`);
};
