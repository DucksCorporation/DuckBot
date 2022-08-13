// @ts-check
const Commands = require("../../Commands.js");
const { EmbedBuilder, resolveColor } = require("discord.js");

module.exports = class Ping extends Commands {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Permet d'obtenir la latence du bot et de l'API.",
            category: "Picsou",
            slash: true,
            args: false,
            owner: false
        });
    };

    async run(interaction) {
        const msg = await interaction.reply({ content: "Pong !", fetchReply: true });

        const embed = new EmbedBuilder()
        // @ts-ignore
        .setThumbnail(this.client.user.displayAvatarURL())
        .setColor(resolveColor("Random"))
        .addFields([
            { name: "Latence Bot :", value: `\`\`\`${msg.createdTimestamp - interaction.createdTimestamp} ms\`\`\``, inline: true },
            { name: "Latence Discord API :", value: `\`\`\`${this.client.ws.ping} ms\`\`\``, inline: true }
        ])
        .setTimestamp()
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })

        return interaction.editReply({ content: null, embeds: [embed] });   
    };
};