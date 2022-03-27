const { Schema, model } = require("mongoose");

const schemaUser = new Schema({
  _id: { type: String, require: true },
  economy: {
    coins: { type: Number, default: 0 },
  },
  exp: {
    xp: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 200 },
  },
  cooldowns: {
    daily: { type: Number, default: 0 },
    work: { type: Number, default: 0 },
  },
});

const User = model("user", schemaUser);
module.exports = User;
