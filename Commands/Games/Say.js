//@ts-check

const { ApplicationCommandOptionType, PermissionsBitField, ChannelType } = require("discord.js");
const Commands = require("../../Commands.js");

module.exports = class Suggserv extends Commands {
    constructor(client) {
        super(client, {
            name: "say",
            description: "Permet de faire répéter un message au bot.",
            category: "Games",
            slash: true,
            args: true,
            owner: false,
            options: [
                {
                    name: "message",
                    description: "Le message à faire répéter.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "channel",
                    description: "Le channel où envoyer le message.",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                }
            ]
        });
    };

    async run(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply("Vous devez avoir la permission de **gérer les messages** pour pouvoir faire cette commande.");

        const content = interaction.options.getString("message");
        const channel = interaction.options.getChannel("channel");

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.MentionEveryone) && content.includes("@everyone") || content.includes("@here")) return interaction.reply("Vous ne pouvez pas mentionner **here** et/ou **everyone** !");
        
        //@ts-ignore
        this.client.channels.cache.get(channel?.id || interaction.channel.id).send(content);
        return interaction.reply({ content: "Message envoyé avec succès.", ephemeral: true });
    };
};