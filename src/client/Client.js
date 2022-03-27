const { Client, Collection } = require("discord.js");
const plugins = require("../utils/main.js");

class Elaina extends Client {
  constructor(options) {
    super(options);
    this.commands = new Collection();
    this.Utils = plugins();
  }
  
  destroy() {
    console.log("O sistema está reiniciando");
    super.destroy();
    process.exit();
  }
}

module.exports = { Elaina };
