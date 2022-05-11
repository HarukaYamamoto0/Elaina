const { MessageEmbed } = require("discord.js");
const { getter } = require("../../../utils/modules/emojis.js");

async function code(client, interaction) {
  const Emojis = new getter(client);

  const member = interaction.options.getMember("usuario") || interaction.member;
  const avatar = member.user.displayAvatarURL({ dynamic: true });
  const name = member.nickname || member.user.tag;
  const user = await client.models.User.findById(member.id);
  
  if (!user)
    return interaction.reply({
      content: "Esse usuário ainda não está registrado na minha database.",
      ephemeral: true,
    });
  
  const { xp, nextLevel } = user.exp;

  const embed = new MessageEmbed()
    .setAuthor({
      name: `Status De ${name}`,
      iconURL: Emojis.get("Information").url,
    })
    .setThumbnail(avatar)
    .addField("Nome: ", name)
    .addField("Progresso: ", `${xp}/${nextLevel}`)
    .setColor(process.env.colorEmbed);

  interaction.reply({
    embeds: [embed],
  });
}

module.exports = code;
