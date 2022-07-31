module.exports = {
    name: "tagall",
    alias: ["tagall"],
    desc: "Tag Everyone in a group",
    type: "users",
    example: "%prefix%command",
	noLimit: true,
    start: async(killua, m, {participants, isGroup}) => {
        if(!isGroup){
            m.reply("Send this command in a group you dumbfuck")
            return
        }
        let arr= []
        let mentionArr = []
        participants.forEach(element => {
            let number = element.id.split("@")
            number = "@" + number[0]
            arr.push(number)
            mentionArr.push(element.id)
        });
        let text = arr.join(" ")
        killua.sendMessage(m.from, { text, mentions: mentionArr })
    }
}