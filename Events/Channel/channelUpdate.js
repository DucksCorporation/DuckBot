//@ts-check

const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const guildModel = require("../../model/guild.js");
const ms = require("ms");

module.exports = async(client, oldChannel, newChannel) => {
    const guildSettings = await guildModel.findOne({ guildId: newChannel.guildId });
    const channelId = guildSettings.logsConfig.channelId;

    if(!channelId || !newChannel.guild.channels.cache.get(channelId) || !guildSettings.logsConfig.events.includes("channelUpdate")) return;

    const fetchedLogs = await newChannel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelUpdate });
    const deletionLog = fetchedLogs.entries.first();
    const { executor } = deletionLog;

    const arr = [];
    let k = 0;

    if(oldChannel.name !== newChannel.name) {
        k += 1;
        arr.push(`Nom: **${oldChannel.name}** => **${newChannel.name}**`);
    };
    if(oldChannel.parentId !== newChannel.parentId) {
        k += 1;
        arr.push(`Catégorie: ${oldChannel.parent ?? "Aucune"} => **${newChannel.parent ?? "Aucune"}**`);
    };
    if(oldChannel.permissionsLocked !== newChannel.permissionsLocked) {
        k += 1;
        arr.push(`Synchronisé avec la catégorie ? ${oldChannel.permissionsLocked ? "Oui" : "Non"} => ${newChannel.permissionsLocked ? "Oui" : "Non"}`);
    };
    if(oldChannel.nsfw !== newChannel.nsfw) {
        k += 1;
        arr.push(`NSFW ? ${oldChannel.nsfw ? "**Oui**" : "**Non**"} => ${newChannel.nsfw ? "**Oui**" : "**Non**"}`);
    };
    if(oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
        k += 1;
        arr.push(`Cooldown: **${ms(oldChannel.rateLimitPerUser * 1e3) || "Aucun"}** => **${ms(newChannel.rateLimitPerUser * 1e3) || "Aucun"}**`);
    };
    if(oldChannel.topic !== newChannel.topic) {
        k += 1;
        arr.push(`Sujet: **${oldChannel.topic ?? "Aucun"}** => **${newChannel.topic ?? "Aucun"}**`);
    };
    if(oldChannel.defaultAutoArchiveDuration !== newChannel.defaultAutoArchiveDuration) {
        k += 1;
        arr.push(`Durée d'archivation automatique: ${oldChannel.defaultAutoArchiveDuration} => ${newChannel.defaultAutoArchiveDuration}`);
    };

    const embed = new EmbedBuilder()
    try {
        embed.setTitle(`${k} ${k > 1 ? "changements ont été" : "changement a été"} fait sur un salon !`)
        .setColor(client.utils.colors.yellow)
        .setDescription(arr.join("\n\n"))
        .setFooter({ text: `${newChannel.id}` })
        .setTimestamp()
    } catch(e) {
        return console.error(e);
    };

    console.log(`Channel updated: ${arr} ; ${newChannel.guild.id} ; ${executor.id}`);

    return client.channels.cache.get(channelId).send({ embeds: [embed] });
};