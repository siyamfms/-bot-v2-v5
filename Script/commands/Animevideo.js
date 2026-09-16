const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "anime",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "র্যান্ডম অ্যানিমে ভিডিও পাঠায়",
	commandCategory: "media",
	usages: "anime",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.run = async ({ api, event }) => {
	const videoUrls = [
		"https://drive.google.com/uc?id=1gI265E7VL9cdyk6TuuFav2uA1HifQs5Y",
		"https://drive.google.com/uc?id=1gMAKxgOmW8KHCGZHHgdy9oVbAQlwju1R",
		"https://drive.google.com/uc?id=1gSBzIdm6lys5uU25xLfO2eJ2T9j5USqB",
		"https://drive.google.com/uc?id=1gT7IaIa7OGZ6DqFaIkZ9wDInscdPM19i",
		"https://drive.google.com/uc?id=1gZ_yXg7-nhugrDFRu3eod7WkqdRx7__z",
		"https://drive.google.com/uc?id=1g_W88siZAAa9t0dfoh4MN_yS1EZi6LES",
		"https://drive.google.com/uc?id=1gagkI-OzhhFp96lgu92zFUe7eRfI-HYB",
		"https://drive.google.com/uc?id=1gaz8T8mZ5I9wjnEkalM_YWe0RKjSjHon",
		"https://drive.google.com/uc?id=1ghSYY81_y75d13dCNVBgsN-KknWFqZPe",
		"https://drive.google.com/uc?id=1grPs_ZOxRLJjeckE_18ufIuXmO4JiqX8",
		"https://drive.google.com/uc?id=1h2LUncQ1EY-qPpvu3jBoIwYpzkcCT3-f",
		"https://drive.google.com/uc?id=1h7wXAn7UCoGjki__OC3KCe7P5YtkSL5",
		"https://drive.google.com/uc?id=1i67IloPzLl4sm1M_-pYF27fmO7ietqwF",
		"https://drive.google.com/uc?id=1oRSrxjBy3TpoJuqvLlr2G-rarEXmpfqb",
		"https://drive.google.com/uc?id=1o_52X4nBwE-ZhNBoELquEpJVNt8s4Nlw",
		"https://drive.google.com/uc?id=1oZYPzoa-nrv86wcHLYJCKDgxyB0WoBlB",
		"https://drive.google.com/uc?id=1oTXBxT0Wgk4fn92lZQww34aPyIOw4JsL",
		"https://drive.google.com/uc?id=1oUECTBiTT4oOV-fIeRCIngN0RDgHYynY",
		"https://drive.google.com/uc?id=1oZDfbjwKAZ8qzy1oOp9bwN6LZfNrWhR9",
		"https://drive.google.com/uc?id=1oJzK17HPM4kWbz4PCmTCZ0Js3dZRoTVI"
	];

	const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
	const cacheDir = path.join(__dirname, "cache");
	const cachePath = path.join(cacheDir, `anime_${Date.now()}.mp4`);

	try {
		await fs.ensureDir(cacheDir);

		const response = await axios({
			method: "GET",
			url: randomVideoUrl,
			responseType: "stream"
		});

		const writer = fs.createWriteStream(cachePath);
		response.data.pipe(writer);

		writer.on("finish", async () => {
			await api.sendMessage(
				{
					body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎬 「 ☆《ANIME VIDEO》☆ 」
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
					attachment: fs.createReadStream(cachePath)
				},
				event.threadID,
				() => fs.unlinkSync(cachePath),
				event.messageID
			);
		});

		writer.on("error", (err) => {
			console.error(err);
			api.sendMessage("» ❌ ভিডিও ডাউনলোড করতে সমস্যা হয়েছে!", event.threadID, event.messageID);
		});

	} catch (error) {
		console.error(error);
		api.sendMessage("» ❌ ভিডিও নিয়ে আসতে সমস্যা হয়েছে!", event.threadID, event.messageID);
	}
};
