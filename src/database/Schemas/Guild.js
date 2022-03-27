const { Schema, model } = require("mongoose");

const schemaGuild = new Schema({
  _id: { type: String, require: true },
});

const Guild = model("guild", schemaGuild);
module.exports = Guild;
