//@ts-check

const { EmbedBuilder } = require("discord.js");
const guildSchema = require("../../model/guild.js");
const moment = require("moment");

module.exports = async(client, invite) => {
    const guildSettings = await guildSchema.findOne({ guildId: invite.guild.id });
    const channelId = guildSettings.logsConfig.channelId;

    if(!channelId || !invite.guild.channels.cache.get(channelId) || !guildSettings.logsConfig.events.includes("inviteCreate")) return;

    const age = {
        0: "N'expire pas",
        1800: "30 minutes",
        3600: "1 heure",
        21600: "6 heures",
        43200: "12 heures",
        86400: "1 jour",
        604800: "7 jours"
    };

    console.log(`Invite created: ${invite.guild.id} ; ${invite.inviter.id}`)

    const embed = new EmbedBuilder()
    .setAuthor({ name: `Une invitation vient d'être crée !`, iconURL: `${invite.inviter.displayAvatarURL()}`})
    .setColor(client.utils.colors.green)
    .setDescription(`
        **Salon:** ${invite.channel}
        **Créateur:** ${invite.inviter} (${invite.inviterId})
        **Url:** ${invite.url}
        **Maximum d'resolveColorisation:** ${invite.maxUses}
        **Duré:** ${age[invite.maxAge]}
        **Crée le:** ${moment(invite.createdAt).format("DD/MM/YYYY à HH:mm:ss")}
        **Expire le: ** ${invite.maxAge !== 0 ? moment(invite.expiresAt).format("DD/MM/YYYY à HH:mm:ss") : "N'expira pas."}
    `)
    .setFooter({ text: `Id du salon : ${invite.channelId}` })
    .setTimestamp()

    return client.channels.cache.get(channelId).send({ embeds: [embed] });
};