const { Elaina } = require("./client/Client");
require("dotenv").config();

async function start() {
  try {
    const client = new Elaina({ intents: 70655 });
    global.fetch = require("node-fetch");

    await require("./fileLoader").loadAll(client);
    await require("./database/index")(client);

    await client.login(process.env.tokenBot);
    console.log("[INDEX] - index carregada com sucesso");
  } catch (err) {
    console.log(err);
  }
}

start();
