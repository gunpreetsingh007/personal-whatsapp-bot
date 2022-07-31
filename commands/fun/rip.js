/** @format */

const DIG = require("discord-image-generation");

module.exports = {
	name: "rip",
    alias: ["rip"],
    desc: "RIP",
    type: "fun",
    example: "%prefix%command",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime }) => {
		if (!quoted) return;
		try{
				if (/image|video|sticker/.test(mime)) {
					let download = await quoted.download();
					const result = await new DIG.Rip().getImage(download);
					killua.sendFile(m.from, result, "", m);
				} 
				else if (quoted.mentions[0]) {
					let url = await killua.profilePictureUrl(quoted.mentions[0], "image");
					const result = await new DIG.Rip().getImage(url);
					killua.sendFile(m.from, result, "", m);
				}
				else {
					let url = await killua.profilePictureUrl(m.sender, "image");
					const result = await new DIG.Rip().getImage(url);
					killua.sendFile(m.from, result, "", m);        
				}
		}
		catch(err){
			m.reply("Couldn't fetch the required image")
		}
	}
}
