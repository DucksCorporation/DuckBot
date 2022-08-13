// @ts-check
const { ApplicationCommandType } = require("discord.js");
const Commands = require("../../Commands.js");

module.exports = class RegisterCommands extends Commands {
    constructor(client) {
        super(client, {
            name: "register",
            description: "Permet de register les commandes slashs.",
            category: "Owner",
            owner: true,
            slash: false,
            args: true
        });
    };

    async run(message) {
        const data = [];

        for(let [name, file] of this.client.commands) {
            // @ts-ignore
            const cmd = new file(this.client);
            if(cmd.owner || !cmd.slash) continue;

            data.push({
                name,
                description: cmd.description || "Description error.",
                options: cmd.options || [],
                type: ApplicationCommandType.ChatInput
            });

            console.log(data)
        };

        // @ts-ignore
        return this.client.application.commands.set(data)
        .then(() => message.channel.send("Ok !"))
        .catch(e => message.channel.send(`${e}`))
    };
};