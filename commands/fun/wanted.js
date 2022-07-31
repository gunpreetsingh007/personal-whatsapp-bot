/** @format */

const Canvacord = require("canvacord");


module.exports = {
    name: "wanted",
    alias: ["wanted"],
    desc: "Well... make someone wanted",
    type: "fun",
    example: "%prefix%command",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime }) => {
		if (!quoted) return;
          try{
                if (/image|video|sticker/.test(mime)) {
                    let download = await quoted.download();
                    const result = await Canvacord.Canvacord.wanted(download, false);
                    killua.sendFile(m.from, result, "", m);
                } 
                else if (quoted.mentions[0]) {
                    let url = await killua.profilePictureUrl(quoted.mentions[0], "image");
                    const result = await Canvacord.Canvacord.wanted(url, false);
                    killua.sendFile(m.from, result, "", m);
                }
                else {
                    let url = await killua.profilePictureUrl(m.sender, "image");
                    const result = await Canvacord.Canvacord.wanted(url, false);
                    killua.sendFile(m.from, result, "", m);              
                }
            }
            catch(err){
                console.log(err)
                return m.reply(`Couldn't fetch the required Image.\n*Error* : ${err}`);
            }
	}
}
