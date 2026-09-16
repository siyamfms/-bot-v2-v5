const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

module.exports.config = {
	name: "art",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "ছবিকে AI অ্যানিমে আর্ট স্টাইলে রূপান্তর করে",
	commandCategory: "editing",
	usages: "ছবিতে রিপ্লাই দিন",
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
	const { messageReply, threadID, messageID } = event;

	if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
		return api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অনুগ্রহ করে কোনো 
» 🥱 একটি ছবির রিপ্লাই দিন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
			threadID,
			messageID
		);
	}

	const imageUrl = messageReply.attachments[0].url;
	const cacheDir = path.join(__dirname, "cache");
	const cachePath = path.join(cacheDir, `artify_${Date.now()}.jpg`);

	try {
		await fs.ensureDir(cacheDir);

	
		const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
		await fs.writeFile(cachePath, Buffer.from(response.data));

	
		const form = new FormData();
		form.append("image", fs.createReadStream(cachePath));

		const apiRes = await axios.post(
			"https://art-api-97wn.onrender.com/artify?style=anime",
			form,
			{ 
				headers: form.getHeaders(), 
				responseType: "arraybuffer" 
			}
		);

		// রেসপন্স সেভ করে পাঠানো
		await fs.writeFile(cachePath, Buffer.from(apiRes.data));

		await api.sendMessage(
			{
				body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅য়সফলভাবে করা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
				attachment: fs.createReadStream(cachePath)
			},
			threadID,
			() => fs.unlinkSync(cachePath),
			messageID
		);

	} catch (err) {
		console.error(err);
		if (fs.existsSync(cachePath)) {
			fs.unlinkSync(cachePath);
		}
		api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ছবি প্রসেস করতে 
» 🤧 সমস্যা হয়েছে! 
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
			threadID,
			messageID
		);
	}
};
