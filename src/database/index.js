const { connect } = require("mongoose");
const { readdirSync } = require("fs");

async function start(client) {
  try {
    const models = readdirSync("./src/database/Schemas/");
    client.models = {};

    for (const model of models) {
      const name = model.split(".")[0];
      client.models[name] = require(`./Schemas/${model}`);
    }

    await connect(process.env.dataToken);
    console.log("[DATABASE] - conectado ao mongoose");
  } catch (err) {
    console.log(err);
  }
}

module.exports = start;
