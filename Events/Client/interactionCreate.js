//@ts-check
const { InteractionType } = require("discord.js");
module.exports = (client, interaction) => {
    const cmd = client.commands.get(interaction.commandName);

    console.log(interaction);

    if(interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if(cmd) new cmd(client).autoComplete?.(interaction)
        return;
    };

    if(!cmd) return;

    try { new cmd(client)?.run?.(interaction); }
    catch(e) { interaction.reply(`${client.utils.emojis.error} ${client.utils.messages.error} \n ${e}`) };
};