const { time } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

async function code(client, interaction) {
  const guild = interaction.guild;
  const avatar = guild.iconURL({ display: true });
  const owner = await client.users.fetch(guild.ownerId, {
    cache: false,
    force: true,
  });
  const member = await guild.members.fetch(interaction.user.id);

  const embed = new MessageEmbed()
    .setAuthor({ name: guild.name, iconURL: avatar })
    .setThumbnail(avatar)
    .addField("🏷️ Nome: ", `${guild.name} (${guild.id})`)
    .addField("🧑‍⚖️ Dono: ", `${owner.tag} (${owner.id})`)
    .addField("🌍 Região: ", guild.preferredLocale)
    .addField("📅 Sua Entrada: ", time(new Date(member.joinedTimestamp)))
    .addField("📅 Data De Criação: ", time(new Date(guild.createdAt)))
    .setColor(process.env.colorEmbed);

  interaction.reply({
    embeds: [embed],
  });
}

module.exports = code;
