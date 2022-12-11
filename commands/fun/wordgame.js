
const axios = require('axios')
const fs = require('fs')
const wordgameJSON = JSON.parse(fs.readFileSync("database/wordgame.json"))
let allWords = fs.readFileSync("database/all_words.txt")
allWords = allWords.toString().split((/(?:\r\n|\n)+/)).map(item => item.toLowerCase())
const commands = ["start", "join", "leave", "forcestart", "stop"]
// console.log(allWords)


global.wordgameIntervalIDMaps

let randis = ["Ishaan"]
let usedWords = []

function randomCharacter() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    for (var i = 0; i < 1; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

function rotateLeft(arr){
    let first = arr.shift();
    arr.push(first);
    return arr;
}

function goToNextPerson(killua, m, body){
    if(!wordgameJSON[m.from]){
        return
    }
    let obj = wordgameJSON[m.from]
    let newArr = rotateLeft(obj.users)
    obj.users = newArr
    obj.startingWord = body.charAt(body.length -1).toUpperCase()
    obj.count = obj.count + 1
    let text = `\n @${obj.users[0].split("@")[0]} Your turn! \n Enter a word starting with ${obj.startingWord} and you got ${obj.time} secs\nMinimum Words Required - ${obj.wordLength}`
    let setIntervalID = setInterval(function(){checkTimeExpiry(killua, m)}, obj.time*1000 )
    wordgameIntervalIDMaps[m.from] = setIntervalID
    let mentionPerson = []
    mentionPerson.push(obj.users[0])
    wordgameJSON[m.from] = obj
    fs.writeFileSync("database/wordgame.json", JSON.stringify(wordgameJSON, null, 4))
    killua.sendMessage(m.from, { text, mentions: mentionPerson })
}

function checkTimeExpiry(killua, m){

    if(!wordgameJSON[m.from]){
        return
    }
    let obj = wordgameJSON[m.from]
    let text = `@${obj.users[0].split("@")[0]} You are out!`
    let mentionPerson = []
    mentionPerson.push(obj.users[0])
    obj.users.shift()
    if(obj.users.length == 1){
        usedWords = []
        text += `\n @${obj.users[0].split("@")[0]} Congratulations! You Won!`
        mentionPerson.push(obj.users[0])
        clearInterval(wordgameIntervalIDMaps[m.from])
        delete wordgameJSON[m.from]
        fs.writeFileSync("database/wordgame.json", JSON.stringify(wordgameJSON, null, 4))
        killua.sendMessage(m.from, { text, mentions: mentionPerson })
        return
    }
    else{
        text += `\n @${obj.users[0].split("@")[0]} Your turn! \n Enter a word starting with ${obj.startingWord} and you got ${obj.time} secs\nMinimum Words Required - ${obj.wordLength}`
        mentionPerson.push(obj.users[0])
    }
    wordgameJSON[m.from] = obj
    fs.writeFileSync("database/wordgame.json", JSON.stringify(wordgameJSON, null, 4))
    killua.sendMessage(m.from, { text, mentions: mentionPerson })
}

module.exports = {
    name: "wordgame",
    alias: ["wordgame"],
    desc: "start a word game",
    type: "fun",
    example: "\n %prefix%command start - Start a word game session \n %prefix%command join - Join a session which is already created \n %prefix%command leave - Leave the current session \n %prefix%command forcestart - Force Start the game \n %prefix%command stop - Force Stop the current session \n",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime, args, body, isGroup }) => {
        try{
            if(!isGroup){
              m.reply("This game is supposed to be played in a group")
              return
            }

            if(body.startsWith("#wordgame") && args[0] && commands.includes(args[0])){
                switch(args[0]) {
                    case "start":
                      if(!wordgameJSON[m.from]){
                         let obj =  {"isActive": false,"wordLength": 3, "count": 0, "time": 60 , "startingWord": randomCharacter(), "users": []}
                         wordgameJSON[m.from] = obj
                         fs.writeFileSync("database/wordgame.json", JSON.stringify(wordgameJSON, null, 4))
                         m.reply("Wordgame session has started. Reply with #wordgame join to join the game")
                      }
                      else{
                        m.reply("Session has already started")
                      }
                      break;
                    case "join":
                      if(wordgameJSON[m.from]){
                            let obj = wordgameJSON[m.from] 
                            if(obj.users.includes(m.sender)){
                                m.reply("How many times you want to join?")
                                return
                            }
                            obj.users.push(m.sender)
                            wordgameJSON[m.from] = obj
                            fs.writeFileSync("database/wordgame.json", JSON.stringify(wordgameJSON, null, 4))
                            m.reply("You have joined the session.")
                        }
                      else{
                        m.reply("What are you trying to join? Squad of idiots? First create a session.")
                      }
                      break;
                    case "leave":
                       if(wordgameJSON[m.from]){
                              let obj = wordgameJSON[m.from] 
                              if(!obj.users.includes(m.sender)){
                                  m.reply("You are not added. First add yourself, then maybe I will throw you out myself.")
                                  return
                              }
                              const index = obj.users.indexOf(m.sender);
                              if (index > -1) { // only splice array when item is found
                                  obj.users.splice(index, 1); // 2nd parameter means remove one item only
                              }
                              wordgameJSON[m.from] = obj
                              fs.writeFileSync("database/wordgame.json", JSON.stringify(wordgameJSON, null, 4))
                              m.reply("You have successfully left the session.")
                          }
                       else{
                            m.reply("What are you trying to leave? Please leave this world and go to mars so we have one less idiot to worry about.")
                       }
                      break;
                    case "forcestart":
                        if(wordgameJSON[m.from]){
                            let obj = wordgameJSON[m.from] 
                            if(obj.users.length < 2){
                                m.reply("Atleast 2 players are required. LOL")
                                return
                            }
                            let text = `@${obj.users[0].split("@")[0]} Your turn! \n Enter a word starting with ${obj.startingWord} and you got ${obj.time} secs.\nMinimum Words Required - ${obj.wordLength}`
                            let setIntervalID = setInterval(function(){checkTimeExpiry(killua, m)}, obj.time*1000 )
                            wordgameIntervalIDMaps[m.from] = setIntervalID
                            obj["isActive"] = true
                            wordgameJSON[m.from] = obj
                            fs.writeFileSync("database/wordgame.json", JSON.stringify(wordgameJSON, null, 4))
                            killua.sendMessage(m.from, { text, mentions: [obj.users[0]] })
                        }
                        else{
                            m.reply("Let me give you a idea. How about start your life because I can't see it.")
                        }
                      break;
                    case "stop":
                        if(wordgameJSON[m.from]){
                            usedWords = []
                            clearInterval(wordgameIntervalIDMaps[m.from])
                            delete wordgameJSON[m.from]
                            fs.writeFileSync("database/wordgame.json", JSON.stringify(wordgameJSON, null, 4))
                            m.reply("Wordgame Session has been stopped")
                        }
                        else{
                            m.reply("What are you trying to stop?")
                        }
                      break;
                    default:
                        return
                      // code block
                  }
            }
            else if(!body.startsWith("#wordgame")){
                let obj = wordgameJSON[m.from]
                if(m.sender != obj.users[0])
                return
                if(body.length < obj.wordLength){
                    m.reply(`Minimum ${obj.wordLength} words are required.`)
                    return
                }
                if(!body.toLowerCase().startsWith(obj.startingWord.toLowerCase())){
                    m.reply(`You need to start the word with ${obj.startingWord}.`)
                    return
                }
                if(usedWords.includes(body.toLowerCase())){
                    m.reply("This word has been already used.")
                    return
                }
                if(allWords.includes(body.toLowerCase()) ){
                    usedWords.push(body.toLowerCase())
                    if(obj.count == 2){
                        obj.wordLength = obj.wordLength + 1
                        obj.time = obj.time - 5
                        obj.count = 0
                        wordgameJSON[m.from] = obj
                        fs.writeFileSync("database/wordgame.json", JSON.stringify(wordgameJSON, null, 4))
                    }
                    clearInterval(wordgameIntervalIDMaps[m.from])
                    if(body.toLowerCase() == "randi"){
                        let index = Math.floor(Math.random() * randis.length)
                        killua.sendMessage(m.from, { text: `${randis[index]} is Accepted` })
                        setTimeout(function(){goToNextPerson(killua, m, body)}, 2000 )
                        return
                    }
                    killua.sendMessage(m.from, { text: `${body} is Accepted` })
                    setTimeout(function(){goToNextPerson(killua, m, body)}, 2000 )
                }
                else{
                    killua.sendMessage(m.from, { text: `${body} is not found` })
                }
            }
        }
        catch(err) {
                m.reply(`✖  An error occurred. ${err}`)
        }
    }
}