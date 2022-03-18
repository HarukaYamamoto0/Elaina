const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getter } = require("../modules/emojis");
const { codeBlock } = require("@discordjs/builders");

async function notifier(client, type, error) {
  const Emojis = new getter(client);
  const { webhookUrl } = process.env;
  const username = client.user.username;
  const avatar = client.user.displayAvatarURL({ dynamic: false });

  let color;
  switch (type) {
    case "Comando Com Error":
      color = "#FF0000";
      break;
    case "Rejeição Não Tratada":
      color = "#FF8C00";
      break;
    case "Error de Sintaxe":
      color = "#6600FF";
      break;
    case "Database Error":
      color = "#90EE90";
      break;
    case "Rejeição Tradada":
      color = "#BCD2EE";
      break;
    default:
      color = process.env.colorEmbed;
      break;
  }

  let message = error.stack;
  message = message.length > 1002 ? message.slice(0, 1002) + "..." : message;
  message = codeBlock("js", stripIndents(message));
  //-------------------------------------------------------------/
  console.log(error);
  //-------------------------EMBED-------------------------------//
  const embed = new MessageEmbed()
    .addField(`${Emojis.get("several")} Tipo de Error: `, type)
    .addField(`${Emojis.get("error")} Error: `, message)
    .setColor(color);

  await fetch(webhookUrl, {
    method: "POST",
    body: JSON.stringify({
      username,
      avatar,
      embeds: [embed],
    }),
    headers: { "Content-type": "application/json" },
  });
  //-------------------------------------------------------------/
}

module.exports = notifier;
