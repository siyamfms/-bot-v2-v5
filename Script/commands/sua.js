const fs = require("fs");
module.exports.config = {
	name: "sua",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "𝐍𝐈𝐉𝐇𝐔𝐌-𝐁𝐎𝐓 Command",
	commandCategory: "no prefix",
	usages: "sua",
	cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID, body } = event;
	if (!body) return;

	const triggers = [
		"suar", "suor", "kuttar bacca", "pig", "dog",
		"সুয়ার", "শুয়োর", "কুত্তার বাচ্চা", "শুয়োরের বাচ্চা", "কুকুর"
	];

	if (triggers.some(word => body.toLowerCase().includes(word.toLowerCase()))) {
		var msg = {
			body: "aisob kintu vlo lge na",
			attachment: fs.createReadStream(__dirname + `/noprefix/suar.mp3`)
		}
		api.sendMessage(msg, threadID, messageID);
		api.setMessageReaction("😡", event.messageID, (err) => {}, true);
	}
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}
