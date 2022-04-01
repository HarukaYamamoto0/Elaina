const { time, codeBlock } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getter } = require("../../../utils/modules/emojis.js");

async function code(client, interaction) {
  const member = interaction.options.getMember("user") || interaction.member;
  const avatar = member.user.displayAvatarURL({ dynamic: true });
  const Emojis = new getter(client);

  const name = member.nickname || member.user.tag;
  const activity = member.presence?.activities[0];
  let status;

  if (activity !== undefined) {
    switch (activity.type) {
      case "PLAYING":
        status = "jogando " + activity.name;
        break;
      case "LISTENING":
        status = "ouvindo " + activity.details;
        break;
      case "STREAMING":
        status = "transmitindo em " + activity.name;
        break;
      case "WATCHING":
        status = "assistindo " + activity.name;
        break;
      case "COMPETITING":
        status = "competindo " + activity.name;
        break;
      case "CUSTOM":
        status = activity.state;
        break;
    }
  } else status = "Nenhuma atividade";

  const flags = {
    64: "House Bravery",
    128: "House Brilliance",
    256: "House Balance",
  };
  const flag = flags[member.user.flags.bitfield] || "Não Encontrado";

  const embed = new MessageEmbed()
    .setAuthor({ name: member.user.tag, iconURL: avatar })
    .setThumbnail(avatar)
    .addField("🏷️ Nome: ", `${name} (${member.id})`)
    .addField(`${Emojis.get("heart")} Status: `, codeBlock("js", status))
    .addField(`${Emojis.get("home")} Hyper Squad: `, flag)
    .addField("⚔️ Cargo Mais Alto: ", member.roles.highest.toString())
    .addField("📅 Conta Criada Em: ", time(new Date(member.user.createdAt)))
    .addField("📅 Entrou No Servidor: ", time(new Date(member.joinedTimestamp)))
    .setColor(process.env.colorEmbed);

  interaction.reply({
    embeds: [embed],
  });
}

module.exports = code;
