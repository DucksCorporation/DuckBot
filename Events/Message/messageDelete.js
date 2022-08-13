const { EmbedBuilder, resolveColor } = require("discord.js");
const guildSchema = require("../../model/guild.js");

module.exports = async(client, message) => {
    const guildSettings = await guildSchema.findOne({ guildId: message.guild.id });
    const channelId = guildSettings.logsConfig.channelId;

    if(message.embeds.length || message.attachments.first() || !channelId || !message.guild.channels.cache.get(channelId) || !guildSettings.logsConfig.events.includes("messageDelete")) return;

    const embed = new EmbedBuilder()
    .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.avatarURL()}`})
    .setColor("#FF0000")
    .setDescription(`
        **Un message envoyé par ${message.author} a été supprimé dans ${message.channel}.**
        ${message.content}
    `)
    .setFooter({ text: `Id de l'utilisateur : ${message.author.id}` })
    .setTimestamp()

    return client.channels.cache.get(channelId).send({ embeds: [embed] });
};