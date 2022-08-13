// @ts-check
const { ApplicationCommandOptionType, ChannelType, PermissionsBitField, EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const Commands = require("../../Commands.js");
const guildModel = require("../../model/guild.js");

module.exports = class Config extends Commands {
    constructor(client) {
        super(client, {
            name: "config",
            description: "Permet de modifier les paramètres du bot.",
            category: "Utilities",
            owner: false,
            slash: true,
            args: true,
            options: [
                {
                    name: "logs",
                    description: "Permet de gérer le salon des logs",
                    type: ApplicationCommandOptionType.SubcommandGroup,
                    options: [
                        {
                            name: "l_edit",
                            description: "Permet de changer le lieu d'envoi des logs.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "channel",
                                    description: "Salon où envoyer les logs.",
                                    type: ApplicationCommandOptionType.Channel,
                                    channelTypes: [ChannelType.GuildText],
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "l_active",
                            description: "Permet d'activer ou de désactiver le système des logs.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [{
                                name: "activation",
                                description: "Voulez-vous activez ce module ?",
                                type: ApplicationCommandOptionType.Boolean,
                                required: true
                            }]
                        },
                        //events
                        {
                            name: "events_add",
                            description: "Permet d'ajouter un événement.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "eventname",
                                    description: "Le nom de l'événement à ajouter.",
                                    type: ApplicationCommandOptionType.String,
                                    autocomplete: true,
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "events_remove",
                            description: "Permet de supprimer un événement.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "eventname",
                                    description: "Le nom de l'événement à supprimer.",
                                    type: ApplicationCommandOptionType.String,
                                    autocomplete: true,
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "welcome",
                    description: "Permet de gérer le salon d'accueil.",
                    type: ApplicationCommandOptionType.SubcommandGroup,
                    options: [
                        {
                            name: "w_edit",
                            description: "Permet de modifier le salon d'envoi.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "channel",
                                    description: "Le salon d'envoi.",
                                    type: ApplicationCommandOptionType.Channel,
                                    channelTypes: [ChannelType.GuildText],
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "w_active",
                            description: "Permet de désactiver le module d'accueil.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "verification",
                                    description: "Êtes vous sûr ?",
                                    type: ApplicationCommandOptionType.Boolean,
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "w_message",
                            description: "Permet de modifier le message de bienvenue.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "message",
                                    description: "Le message à envoyer.",
                                    type: ApplicationCommandOptionType.String,
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "bye",
                    description: "Permet de gérer le salon d'au-revoir.",
                    type: ApplicationCommandOptionType.SubcommandGroup,
                    options: [
                        {
                            name: "b_edit",
                            description: "Permet de modifier le salon d'envoi.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "channel",
                                    description: "Le salon d'envoi.",
                                    type: ApplicationCommandOptionType.Channel,
                                    channelTypes: [ChannelType.GuildText],
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "b_active",
                            description: "Permet de désactiver le module d'au-revoir.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "verification",
                                    description: "Êtes vous sûr ?",
                                    type: ApplicationCommandOptionType.Boolean,
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "b_message",
                            description: "Permet de changer le message d'au-revoir",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "message",
                                    description: "Le message à envoyer lors d'un départ",
                                    type: ApplicationCommandOptionType.String,
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "blacklistfiles",
                    description: "Liste des extensions de fichiers interdites.",
                    type: ApplicationCommandOptionType.SubcommandGroup,
                    options: [
                        {
                            name: "blf_add",
                            description: "Permet d'ajouter une extension à la liste.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "name",
                                    description: "Quels fichiers souhaitez vous interdir ?",
                                    type: ApplicationCommandOptionType.String,
                                    required: true,
                                }
                            ]
                        },
                        {
                            name: "blf_remove",
                            description: "Permet de supprimer une extension de la liste noire.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "name",
                                    description: "Quels fichiers souhaitez vous autoriser ?",
                                    type: ApplicationCommandOptionType.String,
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "blf_execept_role_add",
                            description: "Permet d'autoriser certains rôle à outrepasser cette restriction.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "role",
                                    description: "Le rôle faisant l'objet d'une exception.",
                                    type: ApplicationCommandOptionType.Role,
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "blf_execept_role_remove",
                            description: "Permet de supprimer un rôle de la liste des exceptions",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "role",
                                    description: "Le rôle faisant l'objet d'une suppression.",
                                    type: ApplicationCommandOptionType.Role,
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "infos",
                    description: "Permet d'obtenir la configuration du serveur.",
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    name: "levels",
                    description: "Permet de gérer le système de niveau.",
                    type: ApplicationCommandOptionType.SubcommandGroup,
                    options: [
                        {
                            name: "le_edit",
                            description: "Permet de changer le lieu d'envoi des passage de niveau.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "channel",
                                    description: "Salon où envoyer les messages.",
                                    type: ApplicationCommandOptionType.Channel,
                                    channelTypes: [ChannelType.GuildText],
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "le_active",
                            description: "Permet d'activer ou de désactiver le module de niveaux.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "verification",
                                    description: "Êtes vous sûr ?",
                                    type: ApplicationCommandOptionType.Boolean,
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "le_multiplier",
                            description: "Permet de multiplier l'xp obtenue.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "mul",
                                    description: "Le nombre par lequel sera multiplier l'xp. Doit être compris entre 1 et 2.",
                                    type: ApplicationCommandOptionType.Number,
                                    minValue: 1,
                                    maxValue: 2,
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "suggestion",
                    description: "Permet de gérer le système de suggestion.",
                    type: ApplicationCommandOptionType.SubcommandGroup,
                    options: [
                        {
                            name: "s_edit",
                            description: "Permet de changer le lieu d'envoi des suggestions.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "channel",
                                    description: "Salon où envoyer les suggestions.",
                                    type: ApplicationCommandOptionType.Channel,
                                    channelTypes: [ChannelType.GuildText],
                                    required: true
                                }
                            ]
                        },
                        {
                            name: "s_active",
                            description: "Permet de désactiver le module de suggestion.",
                            type: ApplicationCommandOptionType.Subcommand,
                            options: [
                                {
                                    name: "activation",
                                    description: "Êtes vous sûr ?",
                                    type: ApplicationCommandOptionType.Boolean,
                                    required: true
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    };

    /**
     * @param {import("discord.js").ChatInputCommandInteraction<"cached">} interaction
     * @returns {Promise<unknown>}
     */
    async run(interaction) {
        const guildSettings = await guildModel.findOne({ guildId: interaction.guild.id });
        if(!guildSettings) return interaction.reply(`${this.client.utils.emojis.error} Votre serveur n'est pas dans la base de données. \n Veuillez retirer le bot puis l'ajouter. Si cette erreur persiste, merci de contacter le support.`);

        const { serverSystemConfig, logsConfig, welcomeConfig, leaveConfig, suggestionChannelId, levelsConfig } = guildSettings;

        const modify = async(name, type) => {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply("Permission insuffisante !");

            const format = {
                logs: "logs",
                welcome: "bienvenue",
                leave: "d'au-revoir",
                banFiles: "fichiers interdits",
                level: "niveau",
                suggestion: "suggestion"
            };

            switch(name) {
                case "activation":
                    const value = interaction.options.getBoolean("activation");

                    if(value === serverSystemConfig[type]) return interaction.reply(`Le module est déjà ${serverSystemConfig[type] ? "activé" : "désactivé"} !`);

                    serverSystemConfig[type] = value;
    
                    try {
                        await guildSettings.save();
                        interaction.reply(`Le module a bien été **${serverSystemConfig[type] ? "activé" : "désactivé"}** avec succès !`);
                    } catch(e) {
                        interaction.reply(`${this.client.utils.messages.saveError} \n ${e}`)
                    };
                    break;
                case "channel":
                    const channel = interaction.options.getChannel("channel", true);

                    if(channel.id === guildSettings[type]) return interaction.reply(`<#${channel.id}> est déjà utilisé pour l'envoi de ce paramètre !`);

                    this.client.utils.updateGuild(interaction.guild, { [type]: channel.id });
    
                    try {
                        await guildSettings.save();
                        interaction.reply(`Le salon d'envoi a été réglé sur **<#${channel.id}>**. \n ${guildSettings.serverSystemConfig[type] === false ? this.client.utils.emojis.warning + "Le sytème de" + format[type] + "est désactivé !" : "" }`);
                    } catch(e) {
                        interaction.reply(`${this.client.utils.messages.saveError} \n ${e}`)
                    };
                    break;
                case "message":
                    const msg = interaction.options.getString("message");

                    this.client.utils.updateGuild(interaction.guild, { [type]: msg });

                    try {
                        await guildSettings.save();
                        // @ts-ignore
                        interaction.reply(`Le message à bien été réglé sur : ${msg.length > 100 ? "**" + msg.substring(0, msg.length / 2) + "**..." : "**" + msg + "**"}. \n ${guildSettings.serverSystemConfig[type] === false ? this.client.utils.emojis.warning + "Le sytème de" + format[type] + "est désactivé !" : "" }`);
                    } catch(e) {
                        interaction.reply(`Une erreur s'est produite lors de la sauvegarde : \n ${e}`)
                    };
                    break;
                default: return interaction.reply(`${this.client.utils.emojis.error} ${this.client.utils.messages.internalError} \n Invalid argument 'name': ${name} `)
            };
        };

        switch(interaction.options.getSubcommand(true)) {
            case "infos":
                const baseEmbed = new EmbedBuilder()
                .setAuthor({ name: `Page d'informations de la configuration du serveur ${interaction.guild.name} !` })
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(`Bienvenue ! Veuillez sélectionner un module pour obtenir ses informations.`)
                .setTimestamp()

                const row = new ActionRowBuilder()
                .addComponents([
                    new SelectMenuBuilder()
                        .setCustomId("module")
                        .setPlaceholder("Sélectionnez un module.")
                        .addOptions([
                            {
                                label: "Logs",
                                value: "logs"
                            },
                            {
                                label: "Accueil",
                                value: "welcome"
                            },
                            {
                                label: "Départ",
                                value: "leave"
                            },
                            {
                                label: "Suggestions",
                                value: "suggestions"
                            },
                            {
                                label: "Niveaux",
                                value: "levels"
                            },
                            {
                                label: "Fichier interdits",
                                value: "blacklistFiles"
                            },
                            {
                                label: "Langue",
                                value: "language"
                            }
                        ])
                ])

                // @ts-ignore
                const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 6e5 });

                // @ts-ignore
                collector.on("collect", async i => {
                	if(i.user.id !== interaction.user.id) i.reply({ content: `${this.client.utils.messages.userInteractionError}`, ephemeral: true });

                    let toChange = null;
                    if(i.customId === "module") {
                        switch(i.values[0]) {
                            case "logs":
                                const logsEmbed = new EmbedBuilder()
                                .setTitle("Page d'informations sur les logs.")
                                .setDescription(`
                                    Le module des logs permet d'être informé lorsque l'événement souhaité se produit. \n
                                    Activé ? ${serverSystemConfig.logs ? "Oui" : "Non"} \n
                                    Salon actuel: ${logsConfig.channelId ? "<#" + logsConfig.channelId + ">" : "Aucun"} \n
                                    Événement${logsConfig.events.length > 1 ? "s" : ""} logués: ${logsConfig.events.join(" ; ") || "Aucun"}
                                `)
                                .addFields([
                                    { name: "Commandes:", 
                                      value: `**/config logs events_add <nom de l'événement | all> ou /config logs events_remove <nom de l'événement | all>** => permet d'ajouter ou de supprimer un événement à loguer \n
                                      **/config logs l_active <True | False>** => permet d'activer ou de désactiver le module \n
                                      **/config l_edit <salon textuel>** => permet de changer le salon d'envoi des logs.
                                    ` }
                                ])
                                .setTimestamp()

                                // @ts-ignore
                                toChange = logsEmbed;
                                break;
                            case "welcome":
                                const welcomeEmbed = new EmbedBuilder()
                                .setTitle("Page d'informations sur l'accueil des nouveaux membres.")
                                .setDescription(`
                                    Le module d'accueil permet de gérer l'accueil lors de l'arrivé d'un nouveau membre. \n
                                    Activé ? ${serverSystemConfig.welcome ? "Oui" : "Non"} \n
                                    Salon actuel: ${welcomeConfig.channelId ? "<#" + welcomeConfig.channelId + ">" : "Aucun"} \n
                                    Message actuel: **${welcomeConfig.message}**
                                `)
                                .addFields([
                                    { name: "Commandes:", 
                                      value: `**/config welcome w_message <message> => permet de consulter le message d'accueil \n
                                      **/config welcome w_active <True | False>** => permet d'activer ou de désactiver le module \n
                                      **/config w_edit <salon textuel>** => permet de changer le salon d'envoi des messages de bienvenue.
                                    ` }
                                ])
                                .setTimestamp()

                                // @ts-ignore
                                toChange = welcomeEmbed;
                                break;
                            case "leave":
                                const leaveEmbed = new EmbedBuilder()
                                .setTitle("Page d'informations sur le départ des membres.")
                                .setDescription(`
                                    Le module d'au-revoir permet de gérer l'accueil lors du départ d'un membre. \n
                                    Activé ? ${serverSystemConfig.leave ? "Oui" : "Non"} \n
                                    Salon actuel: ${leaveConfig.ChannelId ? "<#" + leaveConfig.ChannelId + ">" : "Aucun"} \n
                                    Message actuel: **${leaveConfig.message}**
                                `)
                                .addFields([
                                    { name: "Commandes:", 
                                      value: `**/config leave b_message <message> => permet de consulter le message d'au-revoir \n
                                      **/config leave b_active <True | False>** => permet d'activer ou de désactiver le module \n
                                      **/config b_edit <salon textuel>** => permet de changer le salon d'envoi des messages d'au-revoir.
                                    ` }
                                ])
                                .setTimestamp()

                                // @ts-ignore
                                toChange = leaveEmbed;
                                break;
                            case "suggestions":
                                const suggEmbed = new EmbedBuilder()
                                .setTitle("Page d'informations sur les suggestions.")
                                .setDescription(`
                                    Le module de suggestion permet de gérer l'envoi de suggestions sur votre serveur. \n
                                    Activé ? **${serverSystemConfig.suggestion ? "Oui" : "Non"}** \n
                                    Salon actuel: ${suggestionChannelId ? "<#" + suggestionChannelId + ">" : "**Aucun**"} \n
                                `)
                                .addFields([
                                    { name: "Commandes:", 
                                      value: `**/config leave s_active <True | False>** => permet d'activer ou de désactiver le module \n
                                        **/config s_edit <salon textuel>** => permet de changer le salon d'envoi des suggestions.
                                    ` }
                                ])
                                .setTimestamp()

                                // @ts-ignore
                                toChange = suggEmbed;
                                break
                            case "levels":
                                const lvlEmbed = new EmbedBuilder()
                                .setTitle("Page d'informations sur le système de niveau.")
                                .setDescription(`
                                    Le module de niveau permet d'ajouter de l'expérience lors de l'envoi de messages. \n
                                    Activé ? **${serverSystemConfig.levels ? "Oui" : "Non"}** \n
                                    Salon actuel: <#${levelsConfig.channelId + ">" || "**Aucun**"}
                                `)
                                .addFields([
                                    { name: "Commandes:", 
                                      value: `**/config levels le_active <True | False>** => permet d'activer ou de désactiver le module \n
                                        **/config levels le_edit <salon textuel | dm | channel>** => permet d'envoyer le message dans un salon spécifique OU en messages privés OU dans le salon actuel \n
                                        **/config levels le_multiplier <1 | 1.2 | 1.3 | ... | 2>** => permet de multiplier l'ajout d'xp
                                    ` }
                                ])
                                .setTimestamp()

                                // @ts-ignore
                                toChange = lvlEmbed;
                                break;
                            default: return i.update({ content: `${this.client.utils.emojis.error} ${this.client.utils.messages.internalError} i.values[0]: ${i.values[0]}`, embeds: [] });
                        };
                    } else return i.update({ content: `${this.client.utils.emojis.error} ${this.client.utils.messages.internalError} i.customId: ${i.customId}`, embeds: [] })
                    //@ts-ignore
                    await i.update({ content: null, embeds: [toChange], components: [row] });
                });
  
                // @ts-ignore
                return interaction.reply({ embeds: [baseEmbed], components: [row], fetchReply: true });
                
            case "l_active": modify("activation", "logs"); break;
            case "l_edit": modify("channel", "logsConfig.channelId"); break;

            case "events_add":
                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply("Permission insuffisante !");

                const event = interaction.options.getString("eventname");

                //@ts-ignore
                if(event !== "all" && !this.client.utils.eventsName.includes(event)) return interaction.reply(`**${event}** n'est pas un argument valable !`);
                else if(event === "all") {
                    if(logsConfig.events.length >= this.client.utils.eventsName.length) return interaction.reply(`Tous les événements ont déjà été ajoutés.`);

                    for(const e of this.client.utils.eventsName) if(!logsConfig.events.includes(e)) logsConfig.events.push(e);
                } else {
                    if(logsConfig.events.includes(event)) return interaction.reply(`**${event}** a déjà été ajouté.`);

                    logsConfig.events.push(event);
                };

                try {
                    await guildSettings.save();
                    interaction.reply(`${event === "all" ? "Tous les événements ont été activés." : "**" + event + "** a correctement été activé."}`);
                } catch(e) {
                    interaction.reply("Une erreur s'est produite lors de la sauvegarde : \n" + e)
                };
                break;
            case "events_remove":
                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply("Permission insuffisante !");
                let eventName = interaction.options.getString("eventname");

                // @ts-ignore
                if(eventName !== "all" && !this.client.utils.eventsName.includes(eventName)) return interaction.reply(`**${eventName}** n'est pas un argument valable !`);
                else if(eventName === "all") {
                    if(guildSettings.events.length === 0) return interaction.reply(`Tous les événements ont déjà été supprimés.`);

                    guildSettings.events = [];
                } else {
                    if(!guildSettings.events.includes(eventName)) return interaction.reply(`**${eventName}** a déjà été supprimé.`);

                    guildSettings.events.splice(guildSettings.events.indexOf(eventName), 1);
                };

                try {
                    await guildSettings.save();
                    interaction.reply(`${eventName === "all" ? "Tous les événements ont été suprimés." : "**" + eventName + "** a correctement été supprimé."}`);
                } catch(e) {
                    interaction.reply("Une erreur s'est produite lors de la sauvegarde : \n" + e)
                };
                break;

            case "w_active": modify("activation", "welcome"); break;
            case "w_edit": modify("channel", "welcomeConfig.channelId"); break;
            case "w_message": modify("message", "welcomeConfig.message"); break;

            case "b_active": modify("activation", "leave"); break
            case "b_edit": modify("channel", "leaveConfig.channelId"); break;
            case "b_message": modify("message", "leaveConfig.message"); break;

            case "s_active": modify("activation", "suggestion"); break;
            case "s_edit": modify("channel", "suggestionChannelId"); break;

            case "le_active": modify("activation", "level"); break;
            case "le_edit": modify("channel", "levelsConfig.channelId"); break;
            case "le_message": modify("message", "levelsConfig.message")
            case "le_multiplier":
                const mul = interaction.options.getNumber("mul");
                levelsConfig.xpMultiplier = mul;

                try {
                    await guildSettings.save();
                    // @ts-ignore
                    interaction.reply(`L'xp obtenu sera désormais multiplié par: **${mul}**. \n ${guildSettings.serverSystemConfig.levels === false ? this.client.utils.emojis.warning + "Le sytème de niveau est désactivé !" : "" }`);
                } catch(e) {
                    interaction.reply(`${this.client.utils.messages.saveError} \n ${e}`)
                };
                break;
            
            default: return interaction.reply(`${this.client.utils.emojis.error} ${this.client.utils.messages.internalError} 'interaction.options.getSubCommand(true)' value: ${interaction.options.getSubcommand(true)}`); break;
        };
    };

    async autoComplete(interaction) {
        const guildSettings = await guildModel.findOne({ guildId: interaction.guild.id });
        
        const focusedValue = interaction.options.getFocused();

		const choices = ["all", ...this.client.utils.eventsName.filter(e => interaction.options.getSubcommand(true) === "events_add" ? !guildSettings.logsConfig.events.includes(e) : guildSettings.logsConfig.events.includes(e))];
		const filtered = choices.filter(c => c.startsWith(focusedValue));
		interaction.respond(filtered.map(c => ({ name: c, value: c })).slice(0, 25));
    };
};