const { client } = require("./functions");
const { Collection } = require("discord.js");
const { connect } = require("mongoose");

client.commands = new Collection();
client.config = require("./config.json");
client.utils = require("./functions");

process.on("uncaughtException", err => console.error(err));

client.utils.loadCommands();
client.utils.loadEvents();

connect(client.config.dbURI, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
})
.then(() => console.log("Connected to database !"))
.catch(() => console.log)

client.login(client.config.token);