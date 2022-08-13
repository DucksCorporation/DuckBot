// @ts-check

const { EmbedBuilder } = require("discord.js");
const guildModel = require("../../model/guild.js");
const moment = require("moment");

module.exports = async(client, member) => {
    const guildSettings = await guildModel.findOne({ guildId: member.guild.id });
    const channelId = guildSettings?.logsConfig.channelId;
    const leaveChannelId = guildSettings?.leaveChannelId;

    if(!channelId || !leaveChannelId || !member.guild.channels.cache.get(channelId) || !member.guild.channels.cache.get(leaveChannelId) ||
     !guildSettings?.logsConfig.events.includes("guildMemberRemove")) return;

    console.log(`Removing member: ${member.guild.id} ; ${member.id}`);
    

    const embed = new EmbedBuilder()
    .setTitle(`${member.user.tag} a quitté le serveur !`)
    .setColor("#FF0000")
    .setThumbnail(`${member.user.displayAvatarURL({ dynamic: true }) }`)
    .setDescription(`
        Il nous avait rejoins le: ${moment(member.joinedAt).format("DD/MM/YYYY à HH:mm:ss")}
        Ce compte a été créé le: ${moment(member.user.createdAt).format("DD/MM/YYYY à HH:mm:ss")}
    `)
    .setFooter({ text: `Id : ${member.id}` })
    .setTimestamp()

    return (
        client.channels.cache.get(channelId).send({ embeds: [embed] }),
        client.channels.cache.get(leaveChannelId).send(`${guildSettings.leaveMessage}`)
    );
};