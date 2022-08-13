//@ts-check
const Commands = require("../../Commands.js");
const { EmbedBuilder, resolveColor, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const blagues = require("../../Bdd/blagues.json");

module.exports = class Blagues extends Commands {
    constructor(client) {
        super(client, {
            name: "blagues",
            description: "Permet d'obtenir une blague.",
            category: "Games",
            slash: true,
            args: false,
            owner: false
        });
    };

    async run(interaction) {
        const row = new ActionRowBuilder()
        .addComponents(
            [
                new ButtonBuilder()
                .setCustomId("other")
                .setLabel("Une autre ?")
                .setStyle(ButtonStyle.Primary)
            ]
        );

        const embed = new EmbedBuilder()
        .setColor(resolveColor("Random"))
        .setDescription(blagues[Math.floor(Math.random() * blagues.length)])
        .setFooter({ text: "En cas d'erreur sur une blague, merci de contacter le support." })
        .setTimestamp()

        const filter = i => i.customId === "other" && i.user.id === `${interaction.member.id}`;
        const collector = interaction.channel.createMessageComponentCollector({ filter, idle: 6e5 });

        collector.on("collect", async e => {
            embed.setDescription(blagues[Math.floor(Math.random() * blagues.length)]);
        	await e.update({ embeds: [embed], components: [row] });
        });

        return interaction.reply({ embeds: [embed], components: [row] });
    };
};