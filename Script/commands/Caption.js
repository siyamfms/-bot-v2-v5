const moment = require("moment-timezone");

module.exports.config = {
	name: "caption",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "random caption",
	commandCategory: "caption",
	usages: "caption",
	cooldowns: 5
};

const tl = [
	"অনেকের নতুন মানুষ হয়েছে তারা ভালো থাকুক আর আমার হঠাৎ মৃত্যু হোক তারা না জানুক🥹😭",
	"গল্পটা আসোলেই তখন ভালো ছিলো ......! যখন তুমি ছিলে অপরিচিত আর 🙂💔 আর আমি আমার আমিতেই সিমাবদ্ধ 🙂 🙂......!",
	"দুঃখ দিলে‚প্রেম দিলে না‚‚!🌸 নিখুঁতভাবে কাঁদিয়ে বললে আর কেঁদোনা‚‚!!😅❤️‍🩹",
	"যখন মায়া বাড়িয়ে লাভ হয় না, তখন মায়া কাটাতে শিখতে হয় _-⎯⃝😅",
	"নাই কোনো অভিমান-অভিযোগ, ভাল থাকুক সে𑁍❀☹️",
	"ভালো থাকা এখন শুধুমাত্র মিথ্যা হাসির সংজ্ঞা 🙂💔",
	"হাসি মুখে লুকিয়ে থাকে হাজারো কষ্ট 🥀🙂",
	"যখন আপনার কদর শেষ হয়ে যাবে, তখন আপনার উপস্থিতি কারো কাছে গুরুত্ব বহন করবে না 🙂💔",
	"মায়া যত বেশি দাও, কষ্ট তত বেশি পাও 🖤",
	"প্রত্যাশা যত কম, দুঃখ তত কম 🙂",
	"মানুষ শুধু কথা দেয়, সাথে থাকার নয় 🙂💔",
	"একদিন চুপ করে চলে যাবো, কেউ খেয়ালও করবে না 🙂🥀",
	"ভালোবাসা নয়, অভ্যাস মানুষকে ধরে রাখে 🙂💔",
	"যার জন্য সব করো, সে-ই একদিন কষ্টের কারণ হয় 🙂",
	"অতিরিক্ত আশা সবসময় ভাঙে 🙂🥀",
	"চোখের জল কাউকে কখনো ফেরায় না 🙂💔",
	"যত কম বলবে, তত কম কষ্ট পাবে 🙂",
	"একদিন সব অভিমান শেষ হয়ে যাবে 🙂🥀",
	"যাকে ভুলতে চাই, তাকেই বারবার মনে পড়ে 🙂💔",
	"একদিন মানুষ বদলে যায়, কিন্তু স্মৃতি থেকে যায় 🙂",
	"অতিরিক্ত ভালোবাসা একদিন কষ্ট হয়ে ফিরে আসে 🙂🥀",
	"মিথ্যা ভালোবাসা সবচেয়ে কষ্টদায়ক 🙂💔",
	"যতটা আশা করো, ততটাই ভাঙবে 🙂",
	"প্রত্যেকটা হাসির আড়ালে লুকিয়ে থাকে কষ্ট 🙂🥀",
	"ভালো থেকো, দূরে থেকেও 🙂💔",
	"অভিমান জমলে ভালোবাসা কমে যায় 🙂",
	"যার জন্য কষ্ট পাও, সে-ই বোঝে না 🙂🥀",
	"প্রত্যাশা ছাড়া সম্পর্ক টিকে থাকে 🙂💔",
	"মায়া যত কম, দুঃখ তত কম 🙂",
	"কষ্ট পেতে পেতে একদিন শক্ত হয়ে যাবো 🙂🥀"
];

function getRandomCaption() {
	return tl[Math.floor(Math.random() * tl.length)];
}

function formatMessage(caption) {
	return `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
 📝 ${caption}
 `;
}

module.exports.handleEvent = async function ({ api, event }) {
	const { threadID, messageID, body } = event;
	if (!body) return;

	if (body.trim().toLowerCase() === module.exports.config.name) {
		const rand = getRandomCaption();
		return api.sendMessage(formatMessage(rand), threadID, messageID);
	}
};

module.exports.run = async function ({ api, event }) {
	const { threadID, messageID } = event;
	const rand = getRandomCaption();
	return api.sendMessage(formatMessage(rand), threadID, messageID);
};
