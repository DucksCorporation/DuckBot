const { Schema, model } = require("mongoose");

const guildSchema = Schema({
    guildId: String,
    serverSystemConfig: {
        logs: { type: Boolean, default: false },
        welcome: { type: Boolean, default: false },
        leave: { type: Boolean, default: false },
        suggestion: { type: Boolean, default: false },
        banFiles: { type: Boolean, default: false },
        levels: { type: Boolean, default: false },
    },

    //logs
    logsConfig: {
        channelId: { 
            type: String,
            default: null
        },
        events: { 
            type: [String],
            default: []
        },
    },

    //welcomeChannel
    welcomeConfig: {
        channelId: { 
            type: String, 
            default: null
        },
        message: { 
            type: String,
            default: "{userMention} nous a rejoints."
        },
    },

    //leaveChannel
    leaveConfig: {
        channelId: {
            type: String,
            default: null
        },
        message: { 
            type: String,
            default: "{userMention} nous a quittés."
        },
    },

    //suggestionChannel
    suggestionChannelId: {
        type: String,
        default: null
    },

    //Levels
    usersLevels: {
        type: Array,
        default: []
    },
    levelsConfig: {
        channelId: { type: String, default: null },
        message: { type: String, default: "Félicitation {userMention}, vous êtes désormais au niveau {level} !" },
        noXpChannelsId: { type: [String], default: [] },
        xpMultiplier: { type: Schema.Types.Decimal128, default: 1 },
    },

    //BanFiles
    banFiles: { 
        type: [String],
        default: []
    },
    banFilesConfig: {
        message: { 
            type: String,
            default: "Ce type de fichier n'est pas autorisé !"
        },
        exceptRole: { 
            type: [String],
            default: []
        },
    }
});

module.exports = model("Guild", guildSchema);