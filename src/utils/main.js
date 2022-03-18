const { readdirSync } = require("fs");

function start() {
  const plugins = readdirSync("./src/utils/plugins/");
  const Utils = {};

  for (const plugin of plugins) {
    const name = plugin.split(".")[0];
    Utils[name] = require(`./plugins/${plugin}`);
  }

  return Utils;
}

module.exports = start;
