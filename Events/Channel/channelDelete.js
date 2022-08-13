//@ts-check

const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const guildModel = require("../../model/guild.js");

module.exports = async(client, channel) => {
    const guildSettings = await guildModel.findOne({ guildId: channel.guildId });
    const channelId = guildSettings.logsConfig.channelId;

    if(!channelId || !channel.guild.channels.cache.get(channelId) || !guildSettings.logsConfig.events.includes("channelDelete")) return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete });
    const deletionLog = fetchedLogs.entries.first();
    const { executor } = deletionLog;

    console.log(`Channel deleted: ${channel.guild.id} ; $${executor.id}`)

    const embed = new EmbedBuilder()
        .setColor(client.utils.colors.red)
        .setTitle(`Un salon vient d'être supprimé !`)
        .setDescription(`
            Nom du salon : **${channel.name}** \n 
            Catégorie : **${channel.parent ?? "Aucune"}** \n
            Salon supprimé par : **${executor.tag}** \n 
            Type : **${client.utils.channelsList[channel.type]}**
        `)
        .setFooter({ text: `Id du salon : ${channel.id}` })
        .setTimestamp()

    return client.channels.cache.get(channelId).send({ embeds: [embed] });
};