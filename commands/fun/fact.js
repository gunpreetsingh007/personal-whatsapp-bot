const axios = require('axios')

module.exports = {
    name: "fact",
    alias: ["fact"],
    desc: "Will send you random fact.",
    type: "fun",
    example: "%prefix%command",
	noLimit: true,

    start: async (killua, m, {participants, isGroup}) => {
        await axios
            .get(`https://nekos.life/api/v2/fact`)
            .then((response) => {
                // console.log(response);
                const text = `📛 *Fact:* ${response.data.fact}`
                m.reply(text)
            })
            .catch((err) => {
                m.reply(`✖  An error occurred.`)
            })
    }
}
