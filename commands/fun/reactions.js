const axios = require('axios')
const { getRandom } = require("../../lib/Function")
const fs = require('fs')
const libFunction = require("../../lib/Function")
module.exports = {
    name: "reaction",
    alias: [
        'cry',
        'kiss',
        'bully',
        'hug',
        'lick',
        'cuddle',
        'pat',
        'smug',
        'highfive',
        'bonk',
        'yeet',
        'blush',
        'wave',
        'smile',
        'handhold',
        'nom',
        'bite',
        'glomp',
        'kill',
        'slap',
        'cringe',
        'kick',
        'wink',
        'happy',
        'poke',
        'dance'
    ],
    desc: "Let's React.",
    type: "fun",
    example: "%prefix(reaction) [tag users] E.g: %prefixpat @someone",
	noLimit: true,
	start: async (killua, m, { commands,command, prefix, quoted, mime, text }) => {
        let actualWord = ""
        actualWord = m.body.replace(prefix, '')
        actualWord = actualWord.split(" ")[0]
        if(actualWord == "reaction"){
            let data = []
            let cmd = commands.get("reaction") || Array.from(commands.values()).find((v) => v.alias.includes("reaction"))
            if (!cmd || cmd.type == "hide") return m.reply("No Command Found")
            else data.push(`*Command :* ${cmd.name.replace(/^\w/, c => c.toUpperCase())}`)
            if (cmd.alias) data.push(`*Alias :* ${cmd.alias.join(", ")}`)
            if (cmd.use) data.push(`*Use:* ${cmd.use}`);
            if (cmd.desc) data.push(`*Description :* ${cmd.desc}\n`)
            if (cmd.example) data.push(`*Example :* ${cmd.example.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd.name).replace(/%text/gi, text)}`)
            return m.reply(`*Info Command ${cmd.name.replace(/^\w/, c => c.toUpperCase())}*\n\n${data.join("\n")}`)
        }
        let hasMentionSomeone = false
        if(m.mentions.length != 0){
            hasMentionSomeone = true
        }
        const Reactions = {
            cry: ['Cried with', 'is Crying by'],
            kiss: ['Kissed'],
            bully: ['Bullied'],
            hug: ['Hugged'],
            lick: ['Licked'],
            cuddle: ['Cuddled with'],
            pat: ['Patted'],
            smug: ['Smugged at', 'is Smugging by'],
            highfive: ['High-fived'],
            bonk: ['Bonked'],
            yeet: ['Yeeted'],
            blush: ['Blushed at', 'is Blushing by'],
            wave: ['Waved at'],
            smile: ['Smiled at', 'is Smiling by'],
            handhold: ['is Holding Hands with'],
            nom: ['is Eating with', 'is Eating by'],
            bite: ['Bit'],
            glomp: ['Glomped'],
            kill: ['Killed'],
            slap: ['Slapped'],
            cringe: ['Cringed at'],
            kick: ['Kicked'],
            wink: ['Winked at'],
            happy: ['is Happy with', 'is Happy by'],
            poke: ['Poked'],
            dance: ['is Dancing with', 'is Dancing by']
        }
        if(typeof Reactions[actualWord] == "undefined"){
            m.reply("Is that word is in the list?")
            return
        }
        let response = await axios
        .get(`https://api.waifu.pics/sfw/${actualWord}`)
        let url = response.data.url
        let videoBuffer = await libFunction.GIFBufferToVideoBuffer(
            await libFunction.getBuffer(
               url
            )
        )
        let caption = hasMentionSomeone ? `@${m.sender.split('@')[0]} ${Reactions[actualWord][0]} @${m.mentions[0].split('@')[0]}` : ""
        let mentions = hasMentionSomeone ? [m.sender, m.mentions[0]] : []
        killua.sendMessage(
            m.from, 
            { 
                video: videoBuffer, 
                caption: caption,
                gifPlayback: true,
                mentions: mentions
            } 
        )
    }
}

