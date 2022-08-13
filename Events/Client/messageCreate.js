//@ts-check

const { EmbedBuilder, resolveColor } = require("discord.js");
const { readFileSync } = require("fs");
const cooldown = new Set();
const guildModel = require("../../model/guild.js");

module.exports = async(client, message) => {
  if(!message.guild || message.author.bot || message.webhookId) return;

  const guildSettings = await guildModel.findOne({ guildId: message.guild.id });
  if(!guildSettings) await client.utils.createGuild(message.guild);

  const ticketFile = JSON.parse(readFileSync("./Bdd/Tickets/tickets.json").toString());
  
  //#region clientMention
  if(new RegExp(`^<@!?${client.user.id}>$`).test(message.content)) {
    const embed = new EmbedBuilder()
    .setColor(resolveColor("Random"))
    .setDescription("Exécutez la commande `/help` pour obtenir la liste de mes commandes !")
    .setTimestamp()

    return message.channel.send({ embeds: [embed] }).then(m => setTimeout(function() { if(m.deletable) m.delete(); }, 5000));
  };
  //#endregion clientMention

  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const cmdName = args.shift().toLowerCase();
  const cmd = client.commands.get(cmdName);

  if(cmd) {
    const abc = new cmd(client);
    if(abc.slash) return;
    if(abc?.owner && message.author.id !== "636658002010832927") return;
    
    try { abc?.run?.(message, args); }
    catch(e) { message.channel.send(e); };
  };

  if(guildSettings?.serverSystemConfig.levels) {
    //#region xp
    const schemaXp = { id: message.author.id, xp: 0, lvl: 0 };
    const user = guildSettings.usersLevels.find(e => e.id === message.author.id);

    if(guildSettings.levelsConfig.noXpChannelsId.includes(message.channel.id)) return;
    if(!!!user) {
      guildSettings.usersLevels.push(schemaXp);

      try { return await guildSettings.save(); } 
      catch(e) { return console.error(e); };
    };

    if(!cooldown.has(message.author.id)) {
      user.xp += Math.floor((Math.random() * 29 + 1) * guildSettings.levelsConfig.xpMultiplier);
      console.log(user);

      try { await guildSettings.save(); }
      catch(e) { console.error(e); };

      console.log(user);

      cooldown.add(message.author.id);

      setTimeout(() => cooldown.delete(message.author.id), 6e4);
    }; 

    //#region level
    function level(lvlf) { 
      user.lvl += 1;

      let data = `${guildSettings.levelsConfig.message}`;
      const toReplace = { 
        "{userMention}": `<@${message.author.id}>`,
        "{userName}": `${message.author.username}`,
        "{level}": `${user.lvl}`,
        "{xp}": `${user.xp}`
      };

      for(let word of Object.keys(toReplace)) data = data.replace(word, toReplace[word])
      return message.channel.send(data);
    };

    for(let i = 0; i < Object.keys(client.utils.fileInfos.systemLevels.xp).length; i++) if(user.xp >= client.utils.fileInfos.systemLevels.xp[i] && user.lvl < i) level(i); 
  };

  //#endregion level
  //#endregion xp

  //#region ticketLogs
  /*
  if(ticketFile[message.channel.id] && existsSync("./Bdd/Tickets/TicketsLogs/" + `${ticketFile[message.channel.id].reason}.md`)) {
    const pathLogs = "./Bdd/Tickets/TicketsLogs/" + `${ticketFile[message.channel.id].reason}.md`;

    appendFile(pathLogs, `\n${moment(Date.now()).format("DD/MM/YYYY à HH:mm:ss")}, ${message.attachments.first() ? "screen" : ""} ; ${message.author.tag} => ${message.content}`, function(err) {
      if(err) throw err;
    });
  };
  //#endregion ticketLogs
  */

  //#region antiFile
  const fileAttachement = message.attachments.first()?.name;

  if(guildSettings?.banFiles[0] && fileAttachement) {

 };

 guildSettings?.banFiles.forEach(e => {
  if(new RegExp(`.(${e})$`).test(fileAttachement)) {
    message.channel.send("Cette extension est prohibée !");
    if(message.deletable) message.delete();
  };
});
  //#endregion antiFile
};