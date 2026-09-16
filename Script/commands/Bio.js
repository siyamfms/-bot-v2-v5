module.exports.config = {
	name: "bio",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "Change bot's bio",
	commandCategory: "admin",
	usages: "bio [text]",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const bioText = args.join(" ");

	if (!bioText) {
		return api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐈𝐧𝐩𝐮𝐭!
» 💡 আপনি বায়ো দেওয়ার 
» ☹️ জন্য কিছু লিখেননি।
» 📌 𝐔𝐬𝐚𝐠𝐞: bio 
» 😁 আপনার বায়ো টেক্সট
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
			event.threadID,
			event.messageID
		);
	}

	api.changeBio(bioText, (err) => {
		if (err) {
			return api.sendMessage(
				`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ বায়ো পরিবর্তন 
» 🫣 করতে সমস্যা হয়েছে!
» ⚠️ 𝐄𝐫𝐫𝐨𝐫: ${err}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
				event.threadID,
				event.messageID
			);
		}

		return api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📝 𝐁𝐈𝐎 𝐂𝐇𝐀𝐍𝐆𝐄𝐃 
» 🔔 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘!
» 📌 𝐍𝐞𝐰 𝐁𝐢𝐨: ${bioText}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝐀𝗧𝐁𝗢𝗧`,
			event.threadID,
			event.messageID
		);
	});
};
