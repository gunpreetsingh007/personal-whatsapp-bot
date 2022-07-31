const axios = require('axios')

module.exports = {
    name: "why",
    alias: ["why"],
    desc: "Asks you a *why* question.",
    type: "fun",
    example: "%prefix%command",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime }) => {
        await axios
            .get(`https://nekos.life/api/v2/why`)
            .then((response) => {
                // console.log(response);
                let text = `📝 *Question:* ${response.data.why}`
                if( m.sender.split('@')[0] == "917889397662" ||  m.sender.split('@')[0] == "917889687914"  ){
                     text = `📝 *Question:* Why are you a hoe?`
                }
                else if( m.sender.split('@')[0] == "919682175942"){
                    text = `📝 *Question:* Why are you a shakka?`
                }
                m.reply(text)
            })
            .catch((err) => {
                m.reply(`🔍 Error: ${err}`)
            })
    }
}
