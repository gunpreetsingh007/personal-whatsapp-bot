
const axios = require('axios')

module.exports = {
    name: "joke",
    alias: ["joke"],
    desc: "Send a random joke for you.",
    type: "fun",
    example: "%prefix%command",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime }) => {
        await axios
            .get(`https://v2.jokeapi.dev/joke/Any`)
            .then((response) => {
                // console.log(response);
                const text = `🎀 *Category:* ${response.data.category}\n📛 *Joke:* ${response.data.setup}\n🎗️ *Delivery:* ${response.data.delivery}`
                m.reply(text)
            })
            .catch((err) => {
                m.reply(`✖  An error occurred.`)
            })
    }
}
