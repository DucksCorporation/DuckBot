// @ts-check
const Commands = require("../../Commands.js");
const { EmbedBuilder, resolveColor, ApplicationCommandOptionType } = require("discord.js");
let games = [];
let moderation = [];
let picsou = [];
let utilities = [];

module.exports = class Ping extends Commands {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Permet d'obtenir la listes des commandes.",
            category: "Picsou",
            slash: true,
            options: [
                {
                    name: "commande",
                    description: "La commande dont vous souhaitez avoir des informations.",
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                }
            ],
            args: true,
            owner: false
        });
    };

    async run(interaction) {
        const embed = new EmbedBuilder()
        .setTimestamp()
        // @ts-ignore
        .setThumbnail(this.client.user.avatarURL())
        .setColor("#8DD508")

        const cat = {
            Picsou: "Picsou",
            Games: "Jeux",
            Moderation: "Modération",
            Utilities: "Utilitaire"
        };

        //if args
        if(interaction.options.getString("commande")) {
            const command = this.client.commands.get(interaction.options.getString("commande"));
            if(!command) return interaction.reply("Commande introuvable !");
            // @ts-ignore
            const cmd = new command(this.client);
            
            if(cmd?.owner && interaction.author.id !== "636658002010832927") return;

            embed.setTitle(`${cmd.name} infos !`)
            .addFields([
                { name: "Description :", value: `${cmd.description ?? "Aucune description."}`, inline: true },
                { name: "Catégorie :", value: `${cat[cmd.category] ?? "Aucune catégorie."}`, inline: true },
                { name: "Disponible en slash commande ?", value: `${cmd.slash ? "Oui" : "Non"}`, inline: true },
                { name: "Ajout possible d'arguments ?", value: `${cmd.args ? "Oui" : "Non"}`, inline: true }
            ])
        //if not args
        } else {
            for(let [name, file] of this.client.commands) {
                // @ts-ignore
                const cmd = new file(this.client);
                if(cmd.owner) continue;

                switch(cmd.category) {
                    case "Picsou": picsou.push(name); break;
                    case "Games": games.push(name); break;
                    case "Moderation": moderation.push(name); break;
                    case "Utilities": utilities.push(name); break
                    default: return interaction.reply(`[Internal error] \n ${cmd.category} is not a valid argument.`);
                };
            };

            embed.setTitle("La liste de mes commandes !")
            .addFields([
                { name: ":duck: Picsou :", value: `\`${picsou.join("`, `")}\`` },
                { name: ":game_die: Jeux :", value: `\`${games.join("`, `")}\`` },
                { name: ":hammer: Modération :", value: `\`${moderation.join("`, `")}\`` },
                { name: ":information_source: Informations :", value: `\`${utilities.join("`, `")}\`` }
            ])
            .setFooter({ text: `Pour plus d'informations sur une commandes ; faites la commande suivante ; /help <nom de la commande>` })
        };

        await interaction.reply({ embeds: [embed] });
        games = [];
        moderation = [];
        picsou = [];
        utilities = [];
    };

    async autoComplete(interaction) {
        for(let [name, file] of this.client.commands) {
            // @ts-ignore
            const cmd = new file(this.client);
            if(cmd.owner) continue;

            switch(cmd.category) {
                case "Picsou": picsou.push(name); break;
                case "Games": games.push(name); break;
                case "Moderation": moderation.push(name); break;
                case "Utilities": utilities.push(name); break
                default: return console.error(`[autoComplete function] \n ${cmd.category} is not a valid argument.`);
            };
        };
        
        const focusedValue = interaction.options.getFocused();

		const choices = [...games, ...moderation, ...picsou, ...utilities];
		const filtered = choices.filter(c => c.startsWith(focusedValue));
		interaction.respond(filtered.map(c => ({ name: c, value: c })).slice(0, 25));
    };
};