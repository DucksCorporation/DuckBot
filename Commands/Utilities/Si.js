//@ts-check

const { EmbedBuilder, resolveColor } = require("discord.js");
const Commands = require("../../Commands.js");
const moment = require("moment");

module.exports = class Si extends Commands {
    constructor(client) {
        super(client, {
          name: "serveur-infos",
          description: "Donne des informations sur le serveur.",
          category: "Utilities",
          args: false,
          slash: true,
          owner: false
        });
    };

    run(interaction) {
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
        0: "Aucun.",
        1: "Faible.",
        2: "Moyen.",
        3: "Fort.",
        4: "Très fort."
      };
      const afk = {
        60: "1 minute",
        300: "5 minutes",
        900: "15 minutes",
        1800: "30 minutes",
        3600: "1 heure"
      };
      const notif = {
        1: "Mentions uniquement.",
        0: "Tous les messages"
      };

       const embed = new EmbedBuilder()
       .setColor(resolveColor("Random"))
       .setAuthor({ name: `${interaction.guild.name} infos` })
       .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
       .addFields([
          { name: "Nom :", value: `${interaction.guild.name}`, inline: true },
          { name: "Id du serveur:", value: `${interaction.guild.id}`, inline: true },
          { name: "Id du propriétaire:", value: `${interaction.guild.ownerId}`, inline: true, },
          { name: "Créateur:", value: `<@${interaction.guild.ownerId}>`, inline: true, },
          { name: "Crée le:", value: `${moment(interaction.guild.createdAt).format("DD/MM/YYYY à HH:mm:ss")}`, inline: true, },
          { name: "Nombre de membres :", value: `${interaction.guild.memberCount}`, inline: true, },
          { name: "Région du serveur:", value: `${region[interaction.guild.preferredLocale]}`, inline: true, },
          { name: "Nombre de salons :", value: `${interaction.guild.channels.cache.size}`, inline: true, },
          { name: "Niveau du filtre NSFW", value: `${nsfw[interaction.guild.explicitContentFilter]}`, inline: true, },
          { name: "Niveau de vérification:", value: `${lvl[interaction.guild.verificationLevel]}`, inline: true, },
          { name: "Partenaire ?", value: `${interaction.guild.partnered ? "Oui." : "Non."}`, inline: true, },
          { name: "Nombre de boost(s):", value: `${interaction.guild.premiumSubscriptionCount}`, inline: true, },
          { name: "Type de notification", value: `${notif[interaction.guild.defaultMessageNotifications]}`, inline: true, },
          { name: "Salon AFK:", value: `${interaction.guild.afkChannel || "Aucun"}`, inline: true, },
          { name: "Temps avant l'AFK:", value: `${afk[interaction.guild.afkTimeout]}`, inline: true, },
          { name: "Nombre de rôles:", value: `${interaction.guild.roles.cache.size}`, inline: true, },
          { name: "Nombre d'émojis:", value: `${interaction.guild.emojis.cache.size}`, inline: true, },
          { name: "Nombre d'émojis animés:", value: `${interaction.guild.emojis.cache.filter(e => e.animated).size}`, inline: true }
       ])
       .setTimestamp();
          
       return interaction.reply({ embeds: [embed] });
    };
};