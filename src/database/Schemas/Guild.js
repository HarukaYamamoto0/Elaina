const { Schema, model } = require("mongoose");

const schemaGuild = new Schema({
  _id: { type: String, required: true },
  webhookUrl: String,
});

const Guild = model("guild", schemaGuild);
module.exports = Guild;
