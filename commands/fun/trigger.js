
const Canvas = require('canvas')
const GIFEncoder = require('gifencoder')
const fs = require('fs')
const libFunction = require("../../lib/Function")

module.exports =  {
    name: "trigger",
    alias: ["trigger"],
    desc: "Sends the triggered version of someone",
    type: "fun",
    example: "%prefix%command",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime }) => {
   
        try {
            if (!quoted) return;
                    let result
                    if (/image|video|sticker/.test(mime)) {
                        let download = await quoted.download();
                        result = await getImage(download);
                    } 
                    else if (quoted.mentions[0]) {
                        let url = await killua.profilePictureUrl(quoted.mentions[0], "image");
                        result = await getImage(url);
                    }
                    else {
                        let url = await killua.profilePictureUrl(m.sender, "image");
                        result = await getImage(url);        
                    }
                    let videoBuffer = await libFunction.GIFBufferToVideoBuffer(
                       result
                    )
                    killua.sendMessage(
                        m.from, 
                        { 
                            video: videoBuffer, 
                            caption: "Someone got triggered.....",
                            gifPlayback: true
                        } 
                    )
        } catch (err) {
            console.log(err)
            m.reply(`Couldn't fetch the required Image.\n*Error* : ${err}`)
        }
    }
}

const getImage = async (image, timeout = 15) => {
    const img = await Canvas.loadImage(image)
    const GIF = new GIFEncoder(256, 310)
    GIF.start()
    GIF.setRepeat(0)
    GIF.setDelay(timeout)
    const canvas = Canvas.createCanvas(256, 310)
    const ctx = canvas.getContext(`2d`)
    const BR = 20
    const LR = 10
    for (let i = 0; i < 9; i++) {
        ctx.clearRect(0, 0, 256, 310)
        ctx.drawImage(
            img,
            Math.floor(Math.random() * BR) - BR,
            Math.floor(Math.random() * BR) - BR,
            256 + BR,
            310 - 54 + BR
        )
        ctx.fillStyle = `#FF000033`
        ctx.fillRect(0, 0, 256, 310)
        ctx.drawImage(
            await Canvas.loadImage(fs.readFileSync('database/triggered.png') || Buffer.from('')),
            Math.floor(Math.random() * LR) - LR,
            310 - 54 + Math.floor(Math.random() * LR) - LR,
            256 + LR,
            54 + LR
        )
        GIF.addFrame(ctx)
    }
    GIF.finish()
    return GIF.out.getData()
}
