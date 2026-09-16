module.exports.config = {
	name: "onlyadmin",
	version: "1.0",
	hasPermssion: 2,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "এনাবল বা ডিজেবল করুন কেবল এডমিন বট ব্যবহারের মোড",
	commandCategory: "Admin",
	usages: "onlyadmin",
	cooldowns: 5,
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.onLoad = function() {
	const { writeFileSync, existsSync } = require('fs-extra');
	const { resolve } = require("path");
	const path = resolve(__dirname, 'cache', 'data.json');
	if (!existsSync(path)) {
		const obj = {
			adminbox: {}
		};
		writeFileSync(path, JSON.stringify(obj, null, 4));
	} else {
		const data = require(path);
		if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
		writeFileSync(path, JSON.stringify(data, null, 4));
	}
}

module.exports.run = async function ({ api, event, args }) {
	const { threadID, messageID } = event;
	const { resolve } = require("path");
	const pathData = resolve(__dirname, 'cache', 'data.json');
	const database = require(pathData);
	const { adminbox } = database; 
	
	if (adminbox[threadID] == true) {
		adminbox[threadID] = false;
		api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
   ───────────────
   » ✅ এডমিন অনলি মোড 
   » 📴 বন্ধ করা হয়েছে। এখন সবাই 
   » 🤖 𝐁𝐎𝐓 ব্যবহার করতে পারবে
   ───────────────
   » 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
			threadID,
			messageID
		);
	} else {
		adminbox[threadID] = true;
		api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
   ───────────────
    » ✅ এডমিন অনলি মোড 
    » 🔛 চালু করা হয়েছে।
    » 🫶 এখন শুধু আমার বস 𝐒𝐈𝐘𝐀𝐌 
    » 🤗 বট ব্যবহার করতে পারবে
    ───────────────
    » 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
			threadID,
			messageID
		);
	}
}
