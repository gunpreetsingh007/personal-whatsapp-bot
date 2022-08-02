
const axios = require('axios')

const category = ["Miscellaneous", "Dark", "Pun", "Spooky", "Christmas"]

module.exports = {
    name: "joke",
    alias: ["joke"],
    desc: "Send a random joke for you.",
    type: "fun",
    example: "%prefix%command (category/optional['Miscellaneous', 'Dark', 'Pun, 'Spooky', 'Christmas'])",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime, args }) => {
        let typeExist= false
        if(args[0]){
            if(category.includes(args[0])){
                typeExist = true
            }
        }
        try{
            let response =  await axios.get(`https://v2.jokeapi.dev/joke/${typeExist ? args[0] : "Any"}`)
            const text = `🎀 *Category:* ${response.data.category}\n📛 *Joke:* ${response.data.setup}\n🎗️ *Delivery:* ${response.data.delivery}`
            m.reply(text)
        }
        catch(err) {
                m.reply(`✖  An error occurred. ${err}`)
        }
    }
}
