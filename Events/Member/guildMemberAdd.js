//@ts-check

const { EmbedBuilder } = require("discord.js");
const guildSchema = require("../../model/guild.js");
const moment = require("moment");

module.exports = async(client, member) => {
    const guildSettings = await guildSchema.findOne({ guildId: member.guild.id });
    const channelId = guildSettings.logsConfig.channelId;
    const welcomeChannelId = guildSettings.welcomeChannelId;

    if(!channelId || !welcomeChannelId || !member.guild.channels.cache.get(channelId) || !member.guild.channels.cache.get(welcomeChannelId) || !guildSettings.logsConfig.events.includes("guildMemberAdd")) return;

    const embed = new EmbedBuilder()
    .setTitle(`${member.user.tag} à rejoins le serveur !`)
    .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true }) }`)
    .setDescription(`Compte créé le : ${moment(member.user.createdAt).format("DD/MM/YYYY à HH:mm:ss")}`)
    .setColor("#4F9721")
    .setFooter({ text: `Id : ${member.id}` })
    .setTimestamp()

    let data = `${guildSettings.welcomeConfig.message}`;
    const toReplace = { 
      "{userMention}": `<@${member.id}>`,
      "{userName}": `${member.user.username}`,
    };

    for(let word of Object.keys(toReplace)) data = data.replace(word, toReplace[word]);

    return (
        guildSettings.serverSystemConfig.logs ? client.channels.cache.get(channelId).send({ embeds: [embed] }) : false,
        guildSettings.serverSystemConfig.welcome ? client.channels.cache.get(welcomeChannelId).send(`${data}`) : false
    );
};