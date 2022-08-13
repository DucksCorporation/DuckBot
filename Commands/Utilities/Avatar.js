//@ts-check
const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } = require("discord.js");
const Commands = require("../../Commands.js");

module.exports = class Avatar extends Commands {
    constructor(client) {
        super(client, {
            name: "avatar",
            description: "Permet d'obtenir la photo d'un utilisateur.",
            category: "Utilities",
            owner: false,
            slash: true,
            options: [{
                name: "user",
                type: ApplicationCommandOptionType.User,
                description: "Utilisateur"
            }],
            args: true
        });
    };

    run(interaction) {
        if(interaction.user.id !== "636658002010832927") return interaction.reply(":x: Commande en maintenance !");

        const target = interaction.options.getUser("user") || interaction.user;
        const sizeRow = new ActionRowBuilder()
        .addComponents([
            new SelectMenuBuilder()
                .setCustomId("size")
                .setPlaceholder("Taille")
                .addOptions([
                   {
                       label: "16 px",
                       description: "Taille 16 pixels",
                       value: "16 px"
                   },
                   {
                       label: "32 px",
                       description: "Taille 32 pixels",
                       value: "32 pixels"
                   }
                ])
        ])
        const formatRow = new ActionRowBuilder()
        .addComponents([
            new SelectMenuBuilder()
            .setCustomId("format")
            .setPlaceholder("Format")
            .addOptions([
                {
                    label: ".png",
                    description: "Format .png",
                    value: "png"
                },
                {
                    label: ".jpg",
                    description: "Format .jpg",
                    value: "jpg"
                },
                {
                    label: ".jpeg",
                    description: "Format .jpeg",
                    value: "jpeg"
                },
                {
                    label: ".webp",
                    description: "Format .webp",
                    value: "webp"
                }
            ]),
        ])
        const buttonRow = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
                .setCustomId("server")
                .setLabel("Serveur")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("user")
                .setLabel("Utilisateur")
                .setStyle(ButtonStyle.Primary)
        ])
        const embed = new EmbedBuilder()
            .setTitle(`Avatar de ${target.username}`)
            .setImage(`${target.avatarURL({ size: 4096, extension: "png" })}`)
            .setTimestamp()
        
        const filter = i => i.customId === "format" && i.user.id === `${interaction.user.id}`;
        const collector = interaction.channel.createMessageComponentCollector({ filter, idle: 6e5 });

        const change = ext => embed.setImage(`${target.avatarURL({ size: 4096, extension: ext })}`);

        collector.on("collect", async e => {
            console.log(e);
            switch(e.values[0]) {
                case "png": change("png"); break;
                case "jpg": change("jpg"); break;
                case "jpeg": change("jpeg"); break;
                case "webp": change("webp"); break;
                default: return e.update(`[Internal Error] \n Invalid extension: ${e.values[0]}`);
            };

            await e.update({ embeds: [embed], components: [sizeRow, formatRow, buttonRow] });
        });

        return interaction.reply({ embeds: [embed], components: [sizeRow, formatRow, buttonRow] });
    };
};