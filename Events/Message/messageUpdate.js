//@ts-check
const { EmbedBuilder } = require("discord.js");
const guildModel = require("../../model/guild.js");

module.exports = async(client, oldMessage, newMessage) => {
    if(oldMessage.embeds.length || newMessage.embeds.length || oldMessage.attachments.first() ||
       newMessage.attachments.first() || !oldMessage.pinned && newMessage.pinned || !newMessage.pinned && oldMessage.pinned) return;
    
    const guildSettings = await guildModel.findOne({ guildId: newMessage.guild.id });

    if(!guildSettings?.serverSystemConfig.logs || !newMessage.guild.channels.cache.get(guildSettings.logsConfig.channelId) || !guildSettings?.logsConfig.events.includes("messageUpdate")) return;

    console.log(`Message updated: ${newMessage.guild.id} ; ${newMessage.author.id}`);

    const embed = new EmbedBuilder()
    .setAuthor({ name: `${newMessage.author.tag}`, iconURL: `${newMessage.author.avatarURL({ dynamic: true }) }`})
    .setColor(client.utils.colors.yellow)
    .setDescription(`
        [Aller au message](${newMessage.url}) (${newMessage.channel}).
        Id du message : ${newMessage.id}
        
        **Ancien message** :  \n ${oldMessage.content}
        **Nouveau message** : \n  ${newMessage.content}
    `)
    .setFooter({ text: `Id de l'utilisateur : ${newMessage.author.id}` })
    .setTimestamp()

    return client.channels.cache.get(guildSettings.logsConfig.channelId).send({ embeds: [embed] });
};