//@ts-check

const { EmbedBuilder, resolveColor, PermissionsBitField, ApplicationCommandOptionType, ChannelType } = require("discord.js");
const Commands = require("../../Commands.js");
const moment = require("moment");
const { readFileSync, writeFileSync, appendFile, unlink } = require("fs");
const path = "./Bdd/Tickets/tickets.json";
const file = JSON.parse(readFileSync(path).toString());

module.exports = class Ci extends Commands {
    constructor(client) {
        super(client, {
            name: "ticket",
            description: "Permet de créer un ticket.",
            category: "Utilities",
            owner: false,
            slash: true,
            options: [
                {
                    name: "open",
                    description: "Permet d'ouvrir un ticket.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [{
                        name: "reason",
                        description: "Pourquoi souhaitez vous ouvrir un ticket ?",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    }]
                },
                {
                    name: "close",
                    description: "Permet de fermer un ticket.",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "infos",
                    description: "Permet d'obtenir des informations sur le ticket ouvert.",
                    type: ApplicationCommandOptionType.Subcommand
                }
            ],
            args: true
        });
    };

    async run(interaction) {
        if(interaction.user.id !== "636658002010832927") return interaction.reply(":x: Commande en maintenance !");

        switch(interaction.options.getSubcommand()) {
            case "open":
                const reason = interaction.options.getString("reason");

                if(reason.length <= 3 || reason.length > 30) return interaction.reply("La raison doit être comprise entre 3 et 30 !");
                if(reason == "null" || reason == "undefined") return interaction.reply("La raison est invalide !");
                const pathLogs = "./Bdd/Tickets/TicketsLogs/" + `${reason}.md`;

                const embed = new EmbedBuilder()
                .setTitle(`Ticket de ${interaction.member.user.username}`)
                .addFields([
                    { name: "Pour la raison :", value: `${reason}` }
                ])
                .setFooter({ text: `${interaction.member.id}` })
                .setTimestamp()

                await interaction.guild.channels.create(`${reason}`, {
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guildId,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        }, 
                        {
                            id: interaction.member.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.guild.roles.cache.find(r => r.id === "867695416837013512"), //@Staff
                            allow: [PermissionsBitField.Flags.ViewChannel]
                        }
                    ]
                })
                .then((c) => {
                    c.send({ embeds: [embed] })
                    .then(m => m.pin())

                    //#region registerChannel
                    const schema = { 
                        reason: reason,
                        timestamps: Date.now(),
                        userId: interaction.user.id,
                    };

                    if(!file[c.id]) file[c.id] = schema;
                    writeFileSync(path, JSON.stringify(file, null, 4));
                    //#endregion registerChannel 

                    //#region createFile
                    appendFile(pathLogs, "-----Début du ticket-----", err => {
                        if(err) throw err;
                        console.log("Ticket created !");
                    })
                    //#endregion createFile
                })
                .catch(err => interaction.reply("Erreur" + err))

                interaction.reply(`Ticket ouvert avec la raison : **${reason}**`)
                break;
                case "close":
                    if(!interaction.member.roles.cache.find(r => r.id === "867695416837013512")) return interaction.reply("Seul le personnel du staff peux faire cette commande !");
                    if(!file[interaction.channel.id]) return interaction.reply("Ce salon n'est pas un ticket !");

                    await interaction.reply('Souhaitez vous supprimmer ce ticket ? \n Pour confirmer, merci d\'écrire **"oui"** sinon, ne faites rien.');

                    const filter = m => m.content === "oui";

                    return interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ["time"] })
                    .then(() => {
                        return interaction.channel.send("Suppression du ticket dans 5 secondes !")
                        .then(async() => {
                            let form;

                            const { sleep } = require("../../functions");

                            for(let i = 5; i >= 1; i--) {
                                i == 1 ? form = "seconde" : form = "secondes";

                                await sleep(1000);
                                await interaction.channel.send(`${i} ${form}.`)
                            };

                            appendFile(`./Bdd/Tickets/TicketsLogs/${file[interaction.channel.id].reason}.md`, `\n#Fermé par : ${interaction.user.tag}# \n-----Fin du ticket-----`, err => {
                                if(err) throw err;
                                console.log("Ticket closed !");
                            });

                            // @ts-ignore
                            this.client.channels.cache.get("925744986820055090").send({ files: [{
                                attachment: `./Bdd/Tickets/TicketsLogs/${file[interaction.channel.id].reason}.md`,
                                name: "logs.md",
                                description: "Ticket logs."
                            }] })
                            .then(() => {
                                interaction.channel.delete("Fermeture du ticket.")
                                .catch(e => interaction.reply("Erreur" + e))

                                unlink(`./Bdd/Tickets/TicketsLogs/${file[interaction.channel.id].reason}.md`, err => {
                                   if(err) throw err;
                                   console.log(`Fichier supprimé !`);
                                });

                                delete file[interaction.channel.id];
                                writeFileSync(path, JSON.stringify(file, null, 4));

                            }).catch(err => console.log("Une erreur est survenu :"+ err));
                        }).catch(err => console.error(err));
                    }).catch(c => interaction.channel.send("Aucune réponse ; suppression annulée."));
                    break;
                    case "infos":
                        const f = file[interaction.channel.id];
                        const infosEmbed = new EmbedBuilder()
                        .setTitle(`Informations sur ce ticket :`)
                        .setColor(resolveColor("Random"))
                        .setDescription(`
                            Raison d'ouverture : **${f.reason}** \n 
                            Ouvert part : **${this.client.users.cache.get(f.userId) ?? "Erreur !"}** \n
                            Ouvert le : **${moment(f.timestamps).format("DD/MM/YYYY à HH:mm:ss")}**
                        `)
                        .setTimestamp()

                        interaction.reply({ embeds: [infosEmbed] });
                        break;
        };
    };
};