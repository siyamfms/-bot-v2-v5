const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
	name: "boypp",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "Send a random Facebook boy profile picture",
	commandCategory: "Random-IMG",
	usages: "boypp",
	cooldowns: 2,
	dependencies: {
		"request": "",
		"fs-extra": ""
	}
};

module.exports.run = async ({ api, event }) => {
	const imgLinks = [
		"https://i.imgur.com/yCN9Piq.jpeg",
		"https://i.imgur.com/IpA5QUo.jpeg",
		"https://i.imgur.com/Sgz38xm.jpeg",
		"https://i.imgur.com/UZ7CiLk.jpeg",
		"https://i.imgur.com/jqZZm1C.jpeg",
		"https://i.imgur.com/stP854Y.jpeg",
		"https://i.imgur.com/pXzuhBu.jpeg",
		"https://i.imgur.com/iCboC1U.jpeg",
		"https://i.imgur.com/mh8RO7i.jpeg",
		"https://i.imgur.com/peKWGdr.jpeg",
		"https://i.imgur.com/YekeWRX.jpeg",
		"https://i.imgur.com/ktWIKXB.jpeg",
		"https://i.imgur.com/xoNjVNn.jpeg",
		"https://i.imgur.com/KLmB1w6.jpeg",
		"https://i.imgur.com/7tgT5rC.jpeg",
		"https://i.imgur.com/q0mTaXT.jpeg",
		"https://i.imgur.com/c832Y6X.jpeg",
		"https://i.imgur.com/xWiRrNz.jpeg",
		"https://i.imgur.com/e9tFkoc.jpeg",
		"https://i.imgur.com/0LNdctf.jpeg",
		"https://i.imgur.com/DfabYU0.jpeg",
		"https://i.imgur.com/d8E4g8n.png",
		"https://i.imgur.com/Ak3yB2r.jpeg",
		"https://i.imgur.com/Bm2zYuu.jpeg",
		"https://i.imgur.com/GQNt5Dm.jpeg",
		"https://i.imgur.com/VseMop0.jpeg",
		"https://i.imgur.com/pq7xQQz.jpeg",
		"https://i.imgur.com/e8y24F0.jpeg"
	];

	const selectedImage = imgLinks[Math.floor(Math.random() * imgLinks.length)];
	const filePath = `${__dirname}/cache/fb_boy.jpg`;

	const callback = () => {
		api.sendMessage({
			body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👦 𝐇𝐞𝐫𝐞 𝐈𝐬 𝐘𝐨𝐮𝐫 
» 🤌 𝐁𝐨𝐲 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐏𝐢𝐜𝐭𝐮𝐫𝐞!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
			attachment: fs.createReadStream(filePath)
		}, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
	};

	request(encodeURI(selectedImage)).pipe(fs.createWriteStream(filePath)).on("close", callback);
};
