//@ts-check

const { EmbedBuilder } = require("discord.js");
const guildSchema = require("../../model/guild.js");

module.exports = async(client, messages) => {
    const f = messages.first();
    const guildSettings = await guildSchema.findOne({ guildId: f.guild.id });
    const channelId = guildSettings.logsConfig.channelId;

    if(!channelId || !f.guild.channels.cache.get(channelId) || !guildSettings.logsConfig.events.includes("messageDeleteBulk")) return;
    const embed = new EmbedBuilder()
    .setColor("#FF0000")
    .setDescription(`
        **${messages.size} ${messages.size > 1 ? "messages ont" : "message a"} été supprimés dans <#${f.channelId}>.**
    `)
    .setFooter({ text: `Id du salon : ${f.channelId}` })
    .setTimestamp()

    return client.channels.cache.get(channelId).send({ embeds: [embed] });
};