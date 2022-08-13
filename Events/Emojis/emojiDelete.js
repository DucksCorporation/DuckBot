//@ts-check

const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const guildSchema = require("../../model/guild.js");

module.exports = async(client, emoji) => {
    const guildSettings = await guildSchema.findOne({ guildId: emoji.guild.id });
    const channelId = guildSettings?.logsConfig.channelId;

    if(!channelId || !emoji.guild.channels.cache.get(channelId) || !guildSettings.logsConfig.events.includes("emojiDelete")) return;

    const fetchedLogs = await emoji.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.EmojiDelete });
    const deletionLog = fetchedLogs.entries.first();
    const { executor } = deletionLog;

    console.log(`Emoji deleted: ${emoji.guild.id} ; ${executor.tag}`);

    const embed = new EmbedBuilder()
        .setColor(client.utils.colors.red)
        .setTitle(`Un emoji vient d'être supprimé !`)
        .setDescription(`
            Nom : **${emoji.name}**
            Animé ? **${emoji.animated ? "Oui" : "Non"}**
            URL : **${emoji.url}**
            Crée par : **${executor.tag}**
        `)
        .setFooter({ text: `Id de l'émoji : ${emoji.id}` })
        .setTimestamp()

    return client.channels.cache.get(channelId).send({ embeds: [embed] });
};