module.exports.config = {
	name: "out",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "𝐍𝐈𝐉𝐇𝐔𝐌-𝐁𝐎𝐓 Group Leave Command",
	commandCategory: "Admin",
	usages: "out [id]",
	cooldowns: 10,
};

module.exports.run = async function({ api, event, args }) {
	const moment = require("moment-timezone");
	const date = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
	const time = moment.tz("Asia/Dhaka").format("hh:mm:ss a");

	const targetThreadID = (!args[0] || isNaN(args[0])) ? event.threadID : args.join(" ");

	const msgText = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📅 ${date}
» ⏰ ${time}
───────────────
আমি [,] 🤖 𝆠፝𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓 🤖👋 আমাকে ব্যবহার করার জন্য ধন্যবাদ 😘আলবিদা সবাই! আমি এখন গ্রুপ থেকে বের হচ্ছি...😞
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

	return api.sendMessage(msgText, targetThreadID, () => {
		api.removeUserFromGroup(api.getCurrentUserID(), targetThreadID);
	});
};
