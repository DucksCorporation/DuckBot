// @ts-check

const { AttachmentBuilder, ApplicationCommandOptionType } = require("discord.js");
const Commands = require("../../Commands.js");
const { readFileSync } = require("fs");
const Canvas = require("canvas");
const file = JSON.parse(readFileSync("./Bdd/Levels/users.json").toString());

module.exports = class Rank extends Commands {
    constructor(client) {
        super(client, {
            name: "rank",
            description: "Permet d'obtenir le niveau d'un membre.",
            category: "Utilities",
            owner: false,
            slash: true,
            options: [{
                name: "user",
                type: ApplicationCommandOptionType.User,
                description: "utilisateur"
            }],
            args: true
        });
    };
    
    async run(interaction) {
        if(interaction.user.id !== "636658002010832927") return interaction.reply(":x: Commande en maintenance !");
        
        const target = interaction.options.getUser("user") ?? interaction.member.user;
        if(target.bot) return interaction.reply("Cet utilisateur est un bot !");

        if(!file[target.id]) return interaction.reply("Cet utilisateur n'à pas encore ammassé de l'expérience !")

        await interaction.deferReply();

        const canvas = Canvas.createCanvas(750, 300);
		const ctx = canvas.getContext("2d");
		const background = await Canvas.loadImage("./Bdd/Image/rank.jpg");

        function applyText(canvas, text, x) {
            let fontSize = 70;
        
            do ctx.font = `${fontSize -= 10}px sans-serif`;
            while(ctx.measureText(text).width > canvas.width - x);
    
            return ctx.font;
        };

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = "#0099ff";
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		ctx.font = "28px sans-serif";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(`Niveau ${file[target.id].level} | ${file[target.id].xp} xp`, canvas.width / 2.5, canvas.height / 3.5);

		ctx.font = applyText(canvas, `${target.username}`, 300);
		ctx.fillStyle = "#ffffff";
		ctx.fillText(`${target.username}`, canvas.width / 2.5, canvas.height / 1.8);

        const lvl = this.client.utils.fileInfos.systemLevels.xp;
        let min = -1, max = -1;

        for(let i = 0; i < Object.keys(lvl).length; i++) {
            if(file[target.id].level === i) {
                min = lvl[i];
                max = lvl[i + 1] - 1;
                break;
            };
        };

        ctx.fillRect(canvas.width / 2.5, canvas.height / 1.5, 300, 50);
        
        const percent = 300 * (file[target.id].xp / max);
        ctx.fillStyle = "#4444CC";
        ctx.fillRect(300, canvas.height / 1.5, percent, 50);

        ctx.font = "23px sans-serif";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(`${min}`, canvas.width / 3.1, canvas.height / 1.20);
        ctx.fillText(`${max}`, 620, canvas.height / 1.20);

		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await Canvas.loadImage(target.displayAvatarURL({ dynamic: false, extension: "jpg" }));

		ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "rank.jpg" });

        return interaction.editReply({ content: null, files: [attachment] });
    };
};