//@ts-check

const { ApplicationCommandOptionType } = require("discord.js");
const Commands = require("../../Commands.js");
const { readFileSync, writeFileSync } = require("fs");
const path = "./Bdd/Levels/users.json";

module.exports = class ClearLevels extends Commands {
    constructor(client) {
        super(client, {
            name: "clearlevels",
            description: "Permet de supprimer du classement les utilisateurs qui ont quittés le serveur.",
            category: "Utilities",
            options: [
                {
                    name: "verif",
                    type: ApplicationCommandOptionType.Boolean,
                    description: "Vérification",
                    required: true
                }
            ],
            owner: false,
            slash: true,
            args: false
        });
    };

    async run(interaction) {
        if(interaction.user.id !== "636658002010832927") return interaction.reply(":x: Commande en travaux !");
        if(!interaction.member.roles.cache.find(r => r.id === "867695416853004340")) return interaction.reply("Seul les administrateurs peuvent faire cette commande !");
        
        const file = JSON.parse(readFileSync(path).toString());
        const members = interaction.guild.members.cache;

        let k = 0;

        /*members.each(e => {
            if(!file[e.id] && e.bot) {
                k += 1;
                
                console.log(e.id);
                delete file[e.id];  
                writeFileSync(path, JSON.stringify(file, null, 4));
            };
        });*/

        /*const [isInServer, isNotInServer] = members.partition(m => file[m.id]);

        console.log(isInServer, isNotInServer);*/

        members.each(member => {
            if(member.user.bot || !file[member.id]) {
                k += 1;

                delete file[member.id];  
                writeFileSync(path, JSON.stringify(file, null, 4));
            }
        });


        return interaction.reply(`${k} ${k > 0 ? "membres" : "membre"} ont été supprimés du classement !`);
    };
};