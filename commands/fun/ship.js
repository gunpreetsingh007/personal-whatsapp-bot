const fs = require("fs")
const libFunction = require("../../lib/Function")
module.exports = {
    name: "ship",
    alias: ["ship"],
    desc: "Ship People Together",
    type: "fun",
    example: "%prefix%command",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime }) => {
        let percentage = Math.floor(Math.random() * 100)
        let sentence
        if (percentage < 25) {
            sentence = `\t\t\t\t\t*ShipCent : ${percentage}%* \n\t\tThere's still time to reconsider your choices`
        } else if (percentage < 50) {
            sentence = `\t\t\t\t\t*ShipCent : ${percentage}%* \n\t\t Good enough, I guess! 💫`
        } else if (percentage < 75) {
            sentence = `\t\t\t\t\t*ShipCent : ${percentage}%* \n\t\t\tStay together and you'll find a way ⭐️`
        } else if (percentage < 90) {
            sentence = `\t\t\t\t\t*ShipCent : ${percentage}%* \n\tAmazing! You two will be a good couple 💖 `
        } else {
            sentence = `\t\t\t\t\t*ShipCent : ${percentage}%* \n\tYou two are fated to be together 💙`
        }

        if(m.mentions.length < 2){
            m.reply("2 people are required to ship")
            return
        }
        if( (m.mentions[0].split('@')[0] == "917889397662" && m.mentions[1].split('@')[0] == "917889687914" ) || (m.mentions[0].split('@')[0] == "917889687914" && m.mentions[1].split('@')[0] == "917889397662")  ){
            percentage = getRndInteger(91,100)
        }
        const user1 = m.mentions[0]
        const user2 = m.mentions[1]
        let shipFile = fs.readFileSync("database/ship.json")
        const data = JSON.parse(shipFile)

        const ship = data.shipJson.filter((ship) => {
            const shipPercent = parseInt(ship.shipPercent)
            return Math.abs(shipPercent - percentage) <= 10
        })
        // choose a random gif from the array
        const gifLink = ship[Math.floor(Math.random() * ship.length)].gifLink
        let caption = `\t❣️ *Matchmaking...* ❣️ \n`
        caption += `\t\t---------------------------------\n`
        caption += `@${user1.split('@')[0]}  x  @${user2.split('@')[0]}\n`
        caption += `\t\t---------------------------------\n`
        caption += `${sentence}`
        let videoBuffer = await libFunction.GIFBufferToVideoBuffer(
            await libFunction.getBuffer(
                gifLink
            )
        )
        killua.sendMessage(
            m.from, 
            { 
                video: videoBuffer, 
                caption: caption,
                gifPlayback: true,
                mentions: m.mentions
            } 
        )
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
