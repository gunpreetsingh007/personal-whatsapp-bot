const googleTTS = require('google-tts-api');
const fs = require('fs')
module.exports = {
    name: "vn",
    alias: ["vn"],
    desc: "Sends a voice note with your text",
    type: "fun",
    example: "%prefix%command <text required>",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime, args }) => {
           try{

                const audioBase64 = await googleTTS.getAudioBase64((args.length != 0) ? args.join(" ") : "Fudidiya bolna kya hai chutiye ki tu kitna bada fudu hai?" , {
                    lang: 'ja',
                    slow: false,
                    host: 'https://translate.google.com',
                });
                fs.writeFileSync('audio.mp3', Buffer.from(audioBase64.replace('data:audio/mp3; codecs=opus;base64,', ''), 'base64'));
                killua.sendFile(m.from, "audio.mp3", "", m)
           }
           catch(err){
                console.log(err)
                m.reply(`🔍 Error: ${err}`)
            }
    }
}
