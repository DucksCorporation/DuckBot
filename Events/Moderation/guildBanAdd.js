//@ts-check

const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const guildSchema = require("../../model/guild.js");

module.exports = async(client, ban) => {
    const guildSettings = await guildSchema.findOne({ guildId: ban.guild.id });
    const channelId = guildSettings?.logsConfig.channelId;

    if(!channelId || !ban.guild.channels.cache.get(channelId) || !guildSettings?.logsConfig.events.includes("guildBanAdd")) return;

    const fetchedLogs = await ban.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanAdd });
    const deletionLog = fetchedLogs.entries.first();
    const { executor } = deletionLog;

    const embed = new EmbedBuilder()
    .setTitle("Un utilisateur a été banni !")
    .setColor("#FF0000")
    .setDescription(`
        Personne sanctionnée : **${ban.user.tag}**
        Banni par : **${executor.tag}**
    `)
    .setTimestamp()

    return client.channels.cache.get(channelId).send({ embeds: [embed] });
};