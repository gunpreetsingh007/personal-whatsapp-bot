
const axios = require('axios')
const fs = require('fs')
const todJSON = JSON.parse(fs.readFileSync("database/tod.json"))
const commands = ["start", "join", "leave", "next", "stop"]
// console.log(allWords)

function rotateLeft(arr){
    let first = arr.shift();
    arr.push(first);
    return arr;
}

let ratings = ["pg","pg13","r"]

let links = ["https://api.truthordarebot.xyz/v1/truth", "https://api.truthordarebot.xyz/api/wyr", "https://api.truthordarebot.xyz/api/nhie", "https://api.truthordarebot.xyz/api/paranoia"]

module.exports = {
    name: "tod",
    alias: ["tod"],
    desc: "start a truth or dare game",
    type: "fun",
    example: "\n %prefix%command start - Start a tod game session \n %prefix%command join - Join a session which is already created \n %prefix%command leave - Leave the current session \n %prefix%command next - Goes to the next person \n %prefix%command stop - Force stop the current session \n",
	noLimit: true,
	start: async (killua, m, { command, prefix, quoted, mime, args, body, isGroup }) => {
        try{
            if(!isGroup){
              m.reply("This game is supposed to be played in a group you dumbfuck")
              return
            }

            if(body.startsWith("#tod") && args[0] && commands.includes(args[0])){
                switch(args[0]) {
                    case "start":
                      if(!todJSON[m.from]){
                         let obj =  {"users": []}
                         todJSON[m.from] = obj
                         fs.writeFileSync("database/tod.json", JSON.stringify(todJSON, null, 4))
                         m.reply("Truth or Dare session has started. Reply with #tod join to join the game")
                      }
                      else{
                        m.reply("Session has already started you dumbass")
                      }
                      break;
                    case "join":
                      if(todJSON[m.from]){
                            let obj = todJSON[m.from] 
                            if(obj.users.includes(m.sender)){
                                m.reply("How many times you want to join? I wish you had joined this world with brain also.")
                                return
                            }
                            obj.users.push(m.sender)
                            todJSON[m.from] = obj
                            fs.writeFileSync("database/tod.json", JSON.stringify(todJSON, null, 4))
                            m.reply("You have joined the session.")
                        }
                      else{
                        m.reply("What are you trying to join? Squad of idiots? First create a session.")
                      }
                      break;
                    case "leave":
                       if(todJSON[m.from]){
                              let obj = todJSON[m.from] 
                              if(!obj.users.includes(m.sender)){
                                  m.reply("You are not added dumbass. First add yourself, then maybe I will throw you out myself.")
                                  return
                              }
                              const index = obj.users.indexOf(m.sender);
                              if (index > -1) { // only splice array when item is found
                                  obj.users.splice(index, 1); // 2nd parameter means remove one item only
                              }
                              todJSON[m.from] = obj
                              fs.writeFileSync("database/tod.json", JSON.stringify(todJSON, null, 4))
                              m.reply("You have successfully left the session. Bye. No one gonna miss you anyway")
                          }
                       else{
                            m.reply("What are you trying to leave? Please leave this world so we have one less idiot to worry about.")
                       }
                      break;
                    case "next":
                        if(todJSON[m.from]){
                            let obj = todJSON[m.from] 
                            if(obj.users.length < 2){
                                m.reply("Atleast 2 players are required. LOL")
                                return
                            }
                            let user = obj.users[0]
                            let link = links[Math.floor(Math.random() * links.length)]
                            let rating = ratings[Math.floor(Math.random() * ratings.length)]
                            let response = await axios.get(link + `?rating=${rating}`)
                            let question = response.data.question
                            let text = `@${user.split("@")[0]} Your turn! \n ${question}`
                            let newArr = rotateLeft(obj.users)
                            obj.users = newArr
                            todJSON[m.from] = obj
                            fs.writeFileSync("database/tod.json", JSON.stringify(todJSON, null, 4))
                            killua.sendMessage(m.from, { text, mentions: [user] })
                        }
                        else{
                            m.reply("Let me give you a idea. How about start your life because I can't see it.")
                        }
                      break;
                    case "stop":
                        if(todJSON[m.from]){
                            delete todJSON[m.from]
                            fs.writeFileSync("database/tod.json", JSON.stringify(todJSON, null, 4))
                            m.reply("Truth or Dare Session has been stopped")
                        }
                        else{
                            m.reply("Stop your life. It has no meaning anyway.")
                        }
                      break;
                    default:
                        return
                      // code block
                  }
            }
        }
        catch(err) {
                m.reply(`✖  An error occurred. ${err}`)
        }
    }
}