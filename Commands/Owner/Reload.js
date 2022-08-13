//@ts-check

const Commands = require("../../Commands.js");
const { readdirSync } = require("fs");
module.exports = class Eval extends Commands {
    constructor(client) {
        super(client, {
            name: "reload",
            description: "Permet de relancer une commande.",
            category: "Owner",
            owner: true,
            slash: false,
            args: true
        });
    };

    //pas opti+pas fonctionnel en entier
    async run(message, args) {
        if(!args[0]) return message.channel.send("Veuillez mettre le nom d'une commande.");

        let path = "";

        //Commands
        if(this.client.commands.get(args[0].toLowerCase())) {
            const command = this.client.commands.get(args[0].toLowerCase());
            // @ts-ignore
            const cmd = new command(this.client);

            path = `../${cmd.category}/${args[0]}.js`;
            delete require.cache[require.resolve(path)];
            this.client.commands.set(args[0].toLowerCase(), require(path));

            //Events ; Todo.
        } else if(this.client.utils.clientEventsName.includes(args[0])) {
            path = `./Events`;

            readdirSync(path).forEach(dirs => {
              const events = readdirSync(`${path}/${dirs}/`).filter(files => files.endsWith(".js"));
              for(const event of events) {
                const evtName = event.split(".")[0];

                if(evtName == args[0]) {
                    const evt = require(`${path}/${dirs}/${event}`);
                    delete require.cache[require.resolve(evt)];
                    this.client.on(args[0], evt.bind(null, this.client));
                    return message.channel.send(`**${args[0]}** a été relancé avec succès !`);
                } else continue;
              };
            });
        } else return message.channel.send("Fichier introuvable !");

        console.warn(`${args[0]} was reloaded.`);
        return message.channel.send(`**${args[0]}** a été relancé avec succès !`);
    };
};