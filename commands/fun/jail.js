const Canvacord = require("canvacord");

module.exports = {
	name: "jail",
    alias: ["jail"],
    desc: "Who wanna go to jail for being horny?",
    type: "fun",
    example: "Reply to supported image by %prefix%command or tag someone. E.g: %prefix%command @your-poor-friend",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime }) => {
		if (!quoted) return;
		if (/image|video|sticker/.test(mime)) {
            let download = await quoted.download();
			const result = await Canvacord.Canvacord.jail(download, false);
            killua.sendFile(m.from, result, "", m);
        } 
		else if (quoted.mentions[0]) {
            let url = await killua.profilePictureUrl(quoted.mentions[0], "image");
			const result = await Canvacord.Canvacord.jail(url, false);
            killua.sendFile(m.from, result, "", m);
        }
		else {
            return m.reply(`Reply to Supported media With Caption ${prefix + command} or tag someone`, m.from, { quoted: m });
        }
	}
}
