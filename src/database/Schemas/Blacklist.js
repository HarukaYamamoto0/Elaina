const { Schema, model } = require("mongoose");

const schemaBlack = new Schema({
  _id: { type: String, require: true },
  reason: { type: String, default: "Não definido" },
  date: { type: Date, default: Date.now },
});

const Black = model("blacklist", schemaBlack);
module.exports = Black;
