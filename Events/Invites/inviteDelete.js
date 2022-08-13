//@ts-check

const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const guildSchema = require("../../model/guild.js");
const moment = require("moment");

module.exports = async(client, invite) => {
    const guildSettings = await guildSchema.findOne({ guildId: invite.guild.id });
    const channelId = guildSettings.logsConfig.channelId;

    if(!channelId || !invite.guild.channels.cache.get(channelId) || !guildSettings.logsConfig.events.includes("inviteDelete")) return;

    const fetchedLogs = await invite.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.InviteDelete });
    const deletionLog = fetchedLogs.entries.first();
    const { executor } = deletionLog;

    console.log(`Invite deleted: ${invite.guild.id} ; ${executor.id}`)

    const embed = new EmbedBuilder()
    .setAuthor({ name: `Une invitation vient d'être supprimée !`, iconURL: `${executor.displayAvatarURL()}`})
    .setColor(client.utils.colors.red)
    .setDescription(`
        **Supprimé par:** ${executor.tag} (${executor.id})
        **Salon:** ${invite.channel}
        **Url:** ${invite.url}
    `)
    .setFooter({ text: `Id du salon : ${invite.channelId}` })
    .setTimestamp()

    return client.channels.cache.get(channelId).send({ embeds: [embed] });
};