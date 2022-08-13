//@ts-check

const { EmbedBuilder, resolveColor, version, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Commands = require("../../Commands.js");
const ms = require("ms");

module.exports = class Bi extends Commands {
    constructor(client) {
        super(client, {
            name: "bot-infos",
            description: "Permet d'obtenir des informations sur le bot.",
            category: "Picsou",
            slash: true,
            args: false,
            owner: false
        });
    };

    async run(interaction) {
        const embed = new EmbedBuilder()
        .setColor(resolveColor("Random"))
	    // @ts-ignore
	    .setAuthor({ name: `${this.client.user.username} infos` })
        // @ts-ignore
        .setThumbnail(`${this.client.user.avatarURL()}`)
        .addFields([
            // @ts-ignore
            { name: "Nom complet:", value: `${this.client.user.tag}`, inline: true },
            // @ts-ignore
            { name: "Surnom du bot:", value: `${this.client.user.username}`, inline: true },
            // @ts-ignore
            { name: "Id du bot:", value: `${this.client.user.id}`, inline: true },
            { name: "Nombre de commandes:", value: `${this.client.commands.size}`, inline: true },
            { name: "Développé en:", value: "JavaScript", inline: true },   
            { name: "Avec la librairie:", value: "Discord.js", inline: true },
            { name: "Version de discord.js:", value: `${version}`, inline: true },
            { name: "Version de nodejs:", value: `${process.version}`, inline: true },
        ])
        .setFooter({ text: "Créé pour l'argent par : Picsou#0937." })
        .setTimestamp()

        const baseRow = new ActionRowBuilder()
        .addComponents(
            [
                new ButtonBuilder()
                .setCustomId("main")
                .setLabel("Menu")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

                new ButtonBuilder()
                .setCustomId("utils")
                .setLabel("Utilitaires")
                .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                .setCustomId("stats")
                .setLabel("Statistiques")
                .setStyle(ButtonStyle.Secondary)
            ]
        )

        interaction.reply({ embeds: [embed], components: [baseRow] });

        const filter = i => i.customId === "main" || i.customId === "utils" || i.customId === "stats" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 6e5 });

        collector.on("collect", async i => {
            if(i.customId === "main") await i.update({ embeds: [embed], components: [baseRow] });
            else if(i.customId === "utils") {
                const utilsRow = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                        .setCustomId("main")
                        .setLabel("Menu")
                        .setStyle(ButtonStyle.Primary),
        
                        new ButtonBuilder()
                        .setCustomId("utils")
                        .setLabel("Utilitaires")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),

                        new ButtonBuilder()
                        .setCustomId("stats")
                        .setLabel("Statistiques")
                        .setStyle(ButtonStyle.Secondary)
                    ]
                )

                const utilsEmbed = new EmbedBuilder()
                .setTitle("Informations sur comment signaler une suggestion ou un bug.")
                .setDescription("Première étape : rejoignez le [serveur de support](https://discord.gg/QMNu7V8awE).")
                .addFields([
                    { name: "Suggestion", value: "Allez dans le salon <#985269980922789907>.", inline: true },
                    { name: "Bug", value: "Allez dans le salon <#985302489320550420>.", inline: true }
                ])
                .setFooter({ text: "Tout abus sera sanctionné." })

                await i.update({ embeds: [utilsEmbed], components: [utilsRow] });
            } else if(i.customId === "stats") {
                const statsRow = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                        .setCustomId("main")
                        .setLabel("Menu")
                        .setStyle(ButtonStyle.Primary),
        
                        new ButtonBuilder()
                        .setCustomId("utils")
                        .setLabel("Utilitaires")
                        .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                        .setCustomId("stats")
                        .setLabel("Statistiques")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                    ]
                )

                const statsEmbed = new EmbedBuilder()
                .setTitle("Statistiques du bot.")
                .addFields([
                    { name: "Total de salons:", value: `${this.client.channels.cache.size}`, inline: true },
                    { name: "Total de serveurs:", value: `${this.client.guilds.cache.size}`, inline: true },
                    { name: "Total d'utilisateurs:", value: `${this.client.users.cache.size}`, inline: true },
                    //@ts-ignore
                    { name: "Connecté depuis:", value: `${ms(this.client.uptime)}`, inline: true }
                ])
                .setTimestamp()

                await i.update({ embeds: [statsEmbed], components: [statsRow] });
            }
        });
    };
};