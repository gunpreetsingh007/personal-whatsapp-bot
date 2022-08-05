const googleTTS = require('google-tts-api');
const fs = require('fs')
let allLang = [ 'af',
                'sq',
                'am',
                'ar',
                'hy',
                'az',
                'eu',
                'bn',
                'bs',
                'bg',
                'my',
                'ca',
                'yue',
                'zh',
                'hr',
                'cs',
                'da',
                'nl',
                'en',
                'et',
                'fil',
                'fi',
                'fr',
                'gl',
                'ka',
                'de',
                'el',
                'gu',
                'iw',
                'hi',
                'hu',
                'is',
                'id',
                'it',
                'ja',
                'jv',
                'kn',
                'kk',
                'km',
                'ko',
                'lo',
                'lv',
                'lt',
                'mk',
                'ms',
                'ml',
                'mr',
                'mn',
                'ne',
                'no',
                'fa',
                'pl',
                'pt',
                'pa',
                'ro',
                'ru',
                'sr',
                'si',
                'sk',
                'sl',
                'es',
                'su',
                'sw',
                'sv',
                'ta',
                'te',
                'th',
                'tr',
                'uk',
                'ur',
                'uz',
                'vi',
                'zu' ]
module.exports = {
    name: "vn",
    alias: ["vn"],
    desc: "Sends a voice note with your text",
    type: "fun",
    example: "%prefix%command <lang/optional> <text required> All Available Languages: Afrikaans(af), Albanian(sq), Amharic(am), Arabic(ar), Armenian(hy), Azerbaijani(az), Basque(eu), Bengali(bn), Bosnian(bs), Bulgarian(bg), Burmese(my), Catalan(ca), Chinese, Cantonese(yue), Chinese, Mandarin(zh), Croatian(hr), Czech(cs), Danish(da), Dutch(nl), English(en), Estonian(et), Filipino(fil), Finnish(fi), French(fr), Galician(gl), Georgian(ka), German(de), Greek(el), Gujarati(gu), Hebrew(iw), Hindi(hi), Hungarian(hu), Icelandic(is), Indonesian(id), Italian(it), Japanese(ja), Javanese(jv), Kannada(kn), Kazakh(kk), Khmer(km), Korean(ko), Lao(lo), Latvian(lv), Lithuanian(lt), Macedonian(mk), Malay(ms), Malayalam(ml), Marathi(mr), Mongolian(mn), Nepali(ne), Norwegian Bokmål(no), Persian(fa), Polish(pl), Portuguese(pt), Punjabi(pa), Romanian(ro), Russian(ru), Serbian(sr), Sinhala(si), Slovak(sk), Slovenian(sl), Spanish(es), Sundanese(su), Swahili(sw), Swedish(sv), Tamil(ta), Telugu(te), Thai(th), Turkish(tr), Ukrainian(uk), Urdu(ur), Uzbek(uz), Vietnamese(vi), Zulu(zu)",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime, args }) => {
           try{

                if(args[0] && allLang.includes(args[0])){
                    let lang = args[0]
                    args.shift()
                    const audioBase64 = await googleTTS.getAudioBase64((args.length != 0) ? args.join(" ") : "Fudidiya bolna kya hai chutiye ki tu kitna bada fudu hai?" , {
                        lang: lang,
                        slow: false,
                        host: 'https://translate.google.com',
                    });
                    fs.writeFileSync('audio.mp3', Buffer.from(audioBase64.replace('data:audio/mp3; codecs=opus;base64,', ''), 'base64'));
                    killua.sendFile(m.from, "audio.mp3", "", m)
                }
               else{
                const audioBase64 = await googleTTS.getAudioBase64((args.length != 0) ? args.join(" ") : "Fudidiya bolna kya hai chutiye ki tu kitna bada fudu hai?" , {
                    lang: 'ja',
                    slow: false,
                    host: 'https://translate.google.com',
                });
                fs.writeFileSync('audio.mp3', Buffer.from(audioBase64.replace('data:audio/mp3; codecs=opus;base64,', ''), 'base64'));
                killua.sendFile(m.from, "audio.mp3", "", m)
             }
           }
           catch(err){
                console.log(err)
                m.reply(`🔍 Error: ${err}`)
            }
    }
}
