const { ActivityType } = require("discord.js");
const activities = [
    "Salut !", 
    "Le temps c'est de l'argent", 
    "Obtenir la liste des commandes : /help", 
    "Un bug ? Contactez le support !", 
    "Une suggestion ? Rejoignez le support !"
];

module.exports = client => {
    console.log("Connected !");

    let i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: ActivityType.Playing }), 7000);
};