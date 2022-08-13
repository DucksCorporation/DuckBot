//@ts-check

const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const guildSchema = require("../../model/guild.js");

module.exports = async(client, emoji) => {
    const guildSettings = await guildSchema.findOne({ guildId: emoji.guild.id });
    const channelId = guildSettings.logsConfig.channelId;

    if(!channelId || !emoji.guild.channels.cache.get(channelId) || !guildSettings.logsConfig.events.includes("emojiCreate")) return;

    const fetchedLogs = await emoji.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.EmojiCreate });
    const deletionLog = fetchedLogs.entries.first();
    const { executor } = deletionLog;

    console.log(`Emoji created: ${emoji.guild.id} ; ${executor.tag}`);
    
    const embed = new EmbedBuilder()
    .setColor(client.utils.colors.green)
    .setTitle(`Un émoji vient d'être créé !`)
    .setDescription(`
        Nom : **${emoji.name}**
        Animé ? **${emoji.animated ? "Oui" : "Non"}**
        URL : **${emoji.url}**
        Crée par : ${"**" + executor.tag + "**" ?? "inconnue"}
    `)
    .setFooter({ text: `Id de l'émoji : ${emoji.id}` })
    .setTimestamp()

    return client.channels.cache.get(channelId).send({ embeds: [embed] });
};