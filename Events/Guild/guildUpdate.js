//@ts-check

const { EmbedBuilder } = require("discord.js");
const guildModel = require("../../model/guild.js");

module.exports = async(client, oldGuild, newGuild) => {
    const guildSettings = await guildModel.findOne({ guildId: newGuild.id });
    const channelId = guildSettings.logsConfig.channelId;

    if(!channelId || !newGuild.channels.cache.get(channelId) || !guildSettings.logsConfig.events.includes("guildUpdate")) return;

    const region = {
        fr: "France :flag_fr:",
        da: "Danemark :flag_dk:",
        de:"Allemand :flag_de:",
        "en-US": "Américain :flag_us:",
        "es-ES": "Espagnol",
        hr: "Croatie :flag_hr:",
        it: "Italie :flag_it",
        It: "Lituanie",
        hu: "Madagascar",
        nl: "Pays-bas :flag_nl:",
        no: "Norvège :flag_no:",
        pl: "Pologne :flag_pl:",
        "pt-BR": "Brésil",
        ro: "Roumanie :flag_ro:",
        fi: "Finland :flag_fi:",
        "sv-SE": "Suède :flag_sv:",
        vi: "Vietname :flag_vi:",
        true: "Turc :flag_tr:",
        cs: "Cameroon :flag_cs:",
        el: "Eritrea :flag_el:", 
        bg: "Bulgaria :flag_bg:",
        ru: "Russie :flag_ru:",
        uk: "Ukraine",
        hi: "{À remplir}",
        th: "{À remplir}",
        "zh-CN": "{À remplir}",
        ja: "Japon :flag_ja:",
        "zh-TW": "{À remplir}",
        ko: "{À remplir}"
    };
    const nsfw = {
        0: "Désactivé",
        1: "Uniquement les membres sans rôles",
        2: "Tout les membres"
    };
    const lvl = {
      	0: "Aucun",
      	1: "Faible",
      	2: "Moyen",
      	3: "Fort",
      	4: "Très fort"
    };
    const afk = {
        60: "1 minute",
        300: "5 minutes",
        900: "15 minutes",
        1800: "30 minutes",
        3600: "1 heure"
	};
    const notif = {
        ONLY_MENTIONS : "Mentions uniquement",
        ALL_MESSAGES : "Tous les messages"
    };
    let k = 0;
    const arr = [];

    if(oldGuild.afkChannel !== newGuild.afkChannel) {
        k += 1;
        arr.push(`Salon AFK: **${oldGuild.afkChannel || "Aucun"}** => **${newGuild.afkChannel || "Aucun"}**`);
    };
    if(oldGuild.afkTimeout !== newGuild.afkTimeout) {
        k += 1;
        arr.push(`Temps avant l'AFK: **${afk[oldGuild.afkTimeout]}** => **${afk[newGuild.afkTimeout]}**`);
    };
	if(oldGuild.banner !== newGuild.banner) {
		k += 1;
		arr.push(`Le hash de la bannière: **${oldGuild.banner}** => **${newGuild.banner}**`);
	};
	if(oldGuild.defaultMessagesNotifications !== newGuild.defaultMessagesNotifications) {
		k += 1;
		arr.push(`Type de notification par défaut: **${notif[oldGuild.defaultMessagesNotifications]}** => **${notif[newGuild.defaultMessagesNotifications]}**`);
	};
	if(oldGuild.description !== newGuild.description) {
		k += 1;
		arr.push(`Description: **${oldGuild.description || "Aucune"}** => **${newGuild.description}**`);
	};
    if(oldGuild.icon !== newGuild.icon) {
        k += 1;
        arr.push(`Le hash de l'icon: **${oldGuild.icon}** => **${newGuild.icon}**`);
    };
    if(oldGuild.mfaLevel !== newGuild.mfaLevel) {
        k += 1;
        arr.push(`MFA: **${oldGuild.mfaLevel}** => **${newGuild.mfaLevel}**`);
    };
    if(oldGuild.name !== newGuild.name) {
        k += 1
        arr.push(`Nom: **${oldGuild.name}** => **${newGuild.name}**`);
    };
    if(oldGuild.nsfwLevel !== newGuild.nsfwLevel) {
        k += 1;
        arr.push(`Niveau du filtre NSFW: **${oldGuild.nsfwLevel}** => **${newGuild.nsfwLevel}**`);
    };
    if(oldGuild.ownerId !== newGuild.ownerId) {
        k += 1;
        arr.push(`Ancien propriétaire: **<@${oldGuild.ownerId}>** => **<@${newGuild.ownerId}>**`);
    };
    if(oldGuild.partnered !== newGuild.partnered) {
        k += 1;
        arr.push(`Est partenaire ? **${oldGuild.partnered ? "Oui" : "Non"}** => **${newGuild.partnered ? "Oui" : "Non"}**`);
    };
    if(oldGuild.preferredLocale !== newGuild.preferredLocale) {
        k += 1;
        arr.push(`Région: **${region[oldGuild.preferredLocale]}** => **${region[newGuild.preferredLocale]}**`);
    };
    if(oldGuild.premiumProgressBarEnabled !== newGuild.premiumProgressBarEnabled) {
        k += 1;
        arr.push(`Bar de boosts activée ? **${oldGuild.premiumProgressBarEnabled ? "Oui" : "Non"}** => **${newGuild.premiumProgressBarEnabled ? "Oui" : "Non"}**`);
    };
    if(oldGuild.premiumSubscriptionCount !== newGuild.premiumSubscriptionCount) {
        k += 1;
        arr.push(`Nombre de boosts: **${oldGuild.premiumSubscriptionCount}** => **${newGuild.premiumSubscriptionCount}**`);
    };
    if(oldGuild.premiumTier !== newGuild.premiumTier) {
        k += 1;
        arr.push(`Niveau: **${oldGuild.premiumTier}** => **${newGuild.premiumTier}**`);
    };
    if(oldGuild.publicUpdatesChannel !== newGuild.publicUpdatesChannel) {
        k += 1;
        arr.push(`Salon des nouveautés Discord: **${oldGuild.publicUpdatesChannel || "Aucun"}** => **${newGuild.publicUpdatesChannel || "Aucun"}**`);
    };
    if(oldGuild.rulesChannel !== newGuild.rulesChannel) {
        k += 1;
        arr.push(`Salon du règlement: **${oldGuild.rulesChannel || "Aucun"}** => **${newGuild.rulesChannel || "Aucun"}**`)
    };
    if(oldGuild.splash !== newGuild.splash) {
        k += 1;
        arr.push(`Hash de l'image d'invitation: **${oldGuild.splash}** => **${newGuild.splash}**`)
    };
    if(oldGuild.systemChannel !== newGuild.systemChannel) {
        k += 1;
        arr.push(`Salon système: **${oldGuild.systemChannel || "Aucun"}** => **${newGuild.systemChannel || "Aucun"}**`);
    };
    if(oldGuild.verificationLevel !== newGuild.verificationLevel) {
        k += 1;
        arr.push(`Niveau de vérification: **${lvl[oldGuild.verificationLevel]}** => **${lvl[newGuild.verificationLevel]}**`);
    };
    if(oldGuild.verified !== newGuild.verified) {
        k += 1;
        arr.push(`Serveur vérifié ? ${oldGuild.verified ? "Oui" : "Non"} : ${newGuild.verified ? "Oui" : "Non"}`);
    };
    if(oldGuild.widgetChannel !== newGuild.widgetChannel) {
        k += 1;
        arr.push(`Salon widget: **${oldGuild.widgetChannel || "Aucun"}** => **${newGuild.widgetChannel || "Aucun"}**`);
    };
    if(oldGuild.widgetEnabled !== newGuild.widgetEnabled) {
        k += 1;
        arr.push(`Widget activé ? **${oldGuild.widgetEnabled ? "Oui" : "Non"}** => **${newGuild.widgetEnabled ? "Oui" : "Non"}**`);
    };

    console.log(`Guild updated: ${arr} ; ${newGuild.id}`)

    const embed = new EmbedBuilder()
    try {
        embed.setTitle(`${k} ${k > 1 ? "changements ont été" : "changement a été fait"} sur le serveur !`)
        .setColor(client.utils.colors.green)
        .setDescription(arr.join("\n\n"))
    } catch(e) {
        return console.error(e);
    };

    return client.channels.cache.get(channelId).send({ embeds: [embed] });
};