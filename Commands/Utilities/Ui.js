// @ts-check
const { EmbedBuilder, resolveColor, ApplicationCommandOptionType } = require("discord.js");
const Commands = require("../../Commands.js");
const moment = require("moment");

module.exports = class Ui extends Commands {
    constructor(client) {
        super(client, {
            name: "user-infos",
            description: "Permet d'obtenir des informations sur un utilisateur.",
            category: "Utilities",
            owner: false,
            slash: true,
            options: [{
                name: "user",
                type: ApplicationCommandOptionType.User,
                description: "utilisateur"
            }],
            args: true
        });
    };

    async run(interaction) {
        const target = await interaction.guild.members.fetch((interaction.options.getUser("user") || interaction.member).id);

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${target.user.tag} (${target.id})`, iconURL: target.user.bot ? "https://images.emojiterra.com/google/android-11/512px/1f916.png" : "https://images.emojiterra.com/google/android-pie/512px/1f466.png" })
        .setColor(resolveColor("Random"))
        .setImage(target.user.displayAvatarURL())
        .addFields([
            { name: "Nom:", value: `<@${target.id}>`, inline: true },
            { name: "Id:", value: `${target.id}`, inline: true },
            { name: "Crée le:", value: `${moment(target.user.createdTimestamp).format("DD/MM/YYYY à HH:mm:ss")}`, inline: true },
            { name: "Roles:", value: `${target.roles.cache.map(r => r).join(", ").replace(", @everyone", " ")}` }
        ]);

        return interaction.reply({ embeds: [embed] });
    };
};