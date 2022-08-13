//@ts-check
const { EmbedBuilder } = require("discord.js");

module.exports = async(client, guild) => {
    await client.utils.deleteGuild({ guildId : guild.id })
    .then(g => {
        console.log(`J'ai été supprimé d'un serveur ! (${guild.id}, ${guild.name}, ${guild.ownerId})`);

        const embed = new EmbedBuilder()
        .setTitle("Un serveur m'a supprimé.")
        .setThumbnail(`${guild.iconURL()}`)
        .setColor(client.utils.colors.red)
        .setDescription(`
            Id: ${guild.id}
            Nom: ${guild.name}
        `)
        .setFooter({ text: `Id du propriétaire : ${guild.ownerId}` })
        .setTimestamp()
        
        // @ts-ignore
        return client.channels.cache.get("1006708949241827328").send({ embeds: [embed] });
    })
    .catch(g => console.error(`Erreur lors de la suppresion du serveur. ID : ${guild.id} ; name : ${guild.name}`))
};