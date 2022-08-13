// @ts-check
const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const Commands = require("../../Commands.js");
const guildModel = require("../../model/guild.js");

module.exports = class Suggserv extends Commands {
    constructor(client) {
        super(client, {
            name: "suggestion",
            description: "Permet de proposer une suggestion pour votre serveur.",
            category: "Utilities",
            slash: true,
            options: [{
                name: "suggestion",
                type: ApplicationCommandOptionType.String,
                description: "La suggestion à faire.",
                required: true
            }],
            args: true,
            owner: false
        });
    };

    async run(interaction) {
        if(interaction.options.getString("suggestion").length > 1024) return interaction.reply("Votre suggestion ne doit pas dépasser 1024 caractères");

        const guildSettings = await guildModel.findOne({ guildId: interaction.guildId });

        if(!guildSettings?.serverSystemConfig.suggestion) return interaction.reply("Le système de suggestion n'est pas activé sur ce serveur !");
        if(!interaction.guild.channels.cache.get(guildSettings.suggestionChannelId)) return interaction.reply(`Je n'ai pas réussis à trouver le salon d'envoi ! \n Êtes-vous sûr de l'avoir configuré ?`);

        const embed = new EmbedBuilder()
        .setColor(this.client.utils.colors.green)
        .setTitle("Une nouvelle suggestion a été réalisé !")
        .setThumbnail(`${interaction.user.avatarURL({ dynamic: true })}`)
        .addFields([
            { name: "Suggestion :", value: interaction.options.getString("suggestion") }
        ])
        .setFooter({ text: `Suggestion de: ${interaction.user.tag} (${interaction.user.id})` })
        .setTimestamp()

        // @ts-ignore;
        this.client.channels.cache.get(guildSettings.suggestionChannelId).send({ embeds: [embed] }).then(m => {
            m.react("✅");
            m.react("➖");
            m.react("❌");
        });

        return interaction.reply({ content: `Suggestion envoyée dans le salon: <#${guildSettings.suggestionChannelId}> avec succès !` });
    };
};