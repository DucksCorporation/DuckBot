//@ts-check
const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const Commands = require("../../Commands.js");

module.exports = class Clear extends Commands {
    constructor(client) {
        super(client, {
            name: "clear",
            description: "Permet de supprimer un groupe de message.",
            category: "Moderation",
            owner: false,
            slash: true,
            options: [
                {
                    name: "quantitee",
                    type: ApplicationCommandOptionType.Integer,
                    description: "quantite",
                    minValue: 1,
                    maxValue: 100,
                    required: true
                }
            ],
            args: true
        });
    };

    async run(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply("Permission insuffisante !");

        const number = interaction.options.getInteger("quantitee");

        await interaction.channel.bulkDelete(`${number}`, true);
        return interaction.reply({ content: `${number} messages ont été supprimés avec succès !`, ephemeral: true })
    };
};