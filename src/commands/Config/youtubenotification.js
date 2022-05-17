const { Command, builder } = require("../../utils/modules/Command.js");
const { getChannelInfo } = require("yt-channel-info");

class youtubeNotification extends Command {
  constructor() {
    super();
    this.data = new builder()
      .setName("youtubenotification")
      .setDescription("sistema de notificacao do youtube")
      .addStringOption((option) =>
        option
          .setName("link")
          .setDescription("link para o canal do youtube")
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName("canal")
          .setDescription("canal onde as notificacoes irao cair")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("mensagem")
          .setDescription("mais um vídeo no canal {{link}}")
          .setRequired(true)
      );
  }

  async code(client, interaction, { serverDoc }) {
    //~~~~~~~~~~~~~~~DEFINE THE VARIABLES~~~~~~~~~~~~~~~~~~//
    const Channel = client.models.Channel;
    const { guild } = interaction;

    const url = interaction.options.getString("link");
    const textChannel = interaction.options.getChannel("canal");
    const message = interaction.options.getString("mensagem");

    const channels = client.youtubeChannels.filter(
      (channel) => channel.serverId === guild.id
    );
    const channelIds = channels.map((channel) => channel.authorId);

    const error = (msg) => interaction.reply({ content: msg, ephemeral: true });
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

    //~~~~~~~~~~~~~~~~~~~~CHECKING~~~~~~~~~~~~~~~~~~~~~~~~~//
    if (channels.length > 3) {
      return error("A quantidade máxima de canais é **3**!");
    } else if (channelIds.includes(url.split("/").pop())) {
      return error("Esse canal já existe!");
    } else if (textChannel.type !== "GUILD_TEXT") {
      return error("O canal selecionado deve ser de texto!");
    } else if (message.indexOf("{{link}}") === -1) {
      return error("Você não colocou o {{link}} na mensagem.");
    } else if (message.length < 8 || message.length > 125) {
      return error("O máximo de caracteres permitido é:\nmin: 9, max: 125");
    }

    let channel;
    try {
      const id = url.split("/").pop();
      const channelInfo = await getChannelInfo({ channelId: id });

      channel = channelInfo;
    } catch (e) {
      return error("O canal não foi encontrado?");
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

    //~~~~~~~~~~~~~~~~~~CREATING WEBHOOK~~~~~~~~~~~~~~~~~~~//
    let webhookUrl = serverDoc.webhookUrl;

    if (!webhookUrl) {
      const searchWebhooks = await textChannel.fetchWebhooks();

      const webhook = searchWebhooks.find(
        (web) =>
          web.channelId === textChannel.id && web.name === client.user.username
      );

      if (webhook) webhookUrl = webhook.url;
      else {
        const bot = client.user;
        const newWebhook = await textChannel.createWebhook(bot.username, {
          avatar: bot.displayAvatarURL({ dynamic: true }),
        });
        webhookUrl = newWebhook.url;
      }
    }

    await client.models.Guild.findByIdAndUpdate(guild.id, {
      webhookUrl: webhookUrl,
    });
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

    const record = {
      message,
      webhookUrl: webhookUrl,
    };

    //~~~~~~~~~~~~~~REGISTERING THE CHANNEL~~~~~~~~~~~~~~~~//
    const channelDoc = await Channel.findById(channel.authorId);

    if (channelDoc) {
      channelDoc.servers.push(record);
      await Channel.findByIdAndUpdate(channel.authorId, {
        servers: serverDoc.youtube,
      });
    } else {
      await Channel.create({
        _id: channel.authorId,
        servers: [record],
      });
    }

    interaction.reply("O canal foi registrado com sucesso!");
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  }
}

module.exports = youtubeNotification;
