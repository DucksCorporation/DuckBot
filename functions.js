//@ts-check

const { readFileSync, readdirSync } = require("fs");
const { Client, GatewayIntentBits, EmbedBuilder, ChannelType } = require('discord.js');
const guildModel = require("./model/guild.js");

const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildBans,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildIntegrations,
  GatewayIntentBits.GuildWebhooks,
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.DirectMessageReactions,
  GatewayIntentBits.DirectMessageTyping,
] });

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const loadCommands = (dirCommands = "./Commands") => {
  readdirSync(dirCommands).forEach(dirs => {
    const commands = readdirSync(`${dirCommands}/${dirs}/`).filter(files => files.endsWith(".js"));
    for(const file of commands) {
      const getFileName = require(`${dirCommands}/${dirs}/${file}`);
      const { name } = new getFileName(client);
      // @ts-ignore
      client.commands.set(name, getFileName);
      console.log(`${name} loaded !`);
    };
  });
};

const loadEvents = (dirEvent = "./Events") => {
readdirSync(dirEvent).forEach(dirs => {
  const events = readdirSync(`${dirEvent}/${dirs}/`).filter(files => files.endsWith(".js"));
  for(const event of events) {
    const evt = require(`${dirEvent}/${dirs}/${event}`);
    const evtName = event.split(".")[0];
    client.on(evtName, evt.bind(null, client));
    console.log(`${evtName} loaded !`);
  };
});
};

const createGuild = async guild => {
  const createGuild = await new guildModel({ guildId: guild.id });
  createGuild.save()
  .then(g => {
      console.log(`Nouveau serveur ! (${guild.id}, ${guild.name}, ${guild.ownerId})`);

      const embed = new EmbedBuilder()
      .setTitle("Nouveau serveur !")
      // @ts-ignore
      .setColor(client.utils.colors.green)
      .setDescription(`
          Id: ${guild.id}
          Nom: ${guild.name}
      `)
      .setFooter({ text: `Id du propriétaire : ${guild.ownerId}` })
      .setTimestamp()

	    if(guild.iconURL()) embed.setThumbnail(`${guild.iconURL()}`);
  
      // @ts-ignore
      return client.channels.cache.get("1006708949241827328").send({ embeds: [embed] });
  });
};

const deleteGuild = async guild => {
  return guildModel.deleteOne({ guildId: guild.id });
};

const updateGuild = async(guild, settings) => {
	let guildData = await guildModel.findOne({ guildId: guild.id });

	if(typeof guildData != "object") guildData = {};

	for(const key in settings) if(guildData[key] != settings[key]) guildData[key] = settings[key];

	return guildData.updateOne(settings);
};

const fileInfos = JSON.parse(readFileSync("./Bdd/infos.json").toString());
const colors = {
  red: "#E11515",
  green: "#4F9721",
  yellow: "#FFFF00"
};
const eventsName = [
  "messageUpdate",
  "messageDelete",
  "messageDeleteBulk",
  "channelCreate",
  "channelDelete",
  "channelUpdate",
  "emojiCreate",
  "emojiDelete",
  "emojiUpdate",
  "guildBanAdd",
  "guildBanRemove",
  "guildMemberAdd",
  "guildMemberRemove",
  "guildMemberUpdate",
  "guildUpdate",
  "inviteCreate",
  "inviteDelete",
  "roleCreate",
  "roleDelete",
  "roleUpdate",
  "stickerCreate",
  "stickerDelete",
  "stickerUpdate",
  "threadCreate",
  "threadDelete",
  "threadUpdate",
  "userUpdate",
  "voiceStateUpdate",
  "webhookUpdate"
];
const clientEventsName = [
  "MessageUpdate",
  "MessageDelete",
  "MessageDeleteBulk",
  "ChannelCreate",
  "ChannelDelete",
  "ChannelUpdate",
  "EmojiCreate",
  "EmojiDelete",
  "EmojiUpdate",
  "GuildBanAdd",
  "GuildBanRemove",
  "GuildMemberAdd",
  "GuildMemberRemove",
  "GuildMemberUpdate",
  "GuildUpdate",
  "InviteCreate",
  "InviteDelete",
  "RoleCreate",
  "RoleDelete",
  "RoleUpdate",
  "StickerCreate",
  "StickerDelete",
  "StickerUpdate",
  "ThreadCreate",
  "ThreadDelete",
  "ThreadUpdate",
  "UserUpdate",
  "VoiceStateUpdate",
  "WebhookUpdate"
];
const channelsList = {
  [ChannelType.GuildText]: "Textuel",
  [ChannelType.GuildVoice]: "Vocal",
  [ChannelType.GuildCategory]: "Catégorie",
  [ChannelType.GuildNews]: "Salon des annonces",
  [ChannelType.GuildNewsThread]: "Thread d'un salon d'annonces",
  [ChannelType.GuildPublicThread]: "Thread d'un salon publique",
  [ChannelType.GuildPrivateThread]: "Thread d'un salon privé",
  [ChannelType.GuildStageVoice]: "Salon de stage",
};
const emojis = require("./Bdd/emojis.json");
const messages = require("./Bdd/messages.json");

module.exports = {
  fileInfos,
  colors,
  client,
  eventsName,
  clientEventsName,
  channelsList,
  emojis,
  messages,

  loadEvents,
  loadCommands,
  sleep,
  createGuild,
  deleteGuild,
  updateGuild,
};