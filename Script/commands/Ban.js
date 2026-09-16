module.exports.config = {
	name: "ban",
	version: "8.0.2",
	hasPermssion: 2,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "Global + Manual Ban System",
	commandCategory: "system",
	usages: "-ban on/off | -ban [@mention/reply/UID/link/name] | -ban list",
	cooldowns: 0
};

async function getUIDByFullName(api, threadID, body) {
	if (!body.includes("@")) return null;
	const match = body.match(/@(.+)/);
	if (!match) return null;
	const targetName = match[1].trim().toLowerCase().replace(/\s+/g, " ");
	const threadInfo = await api.getThreadInfo(threadID);
	const users = threadInfo.userInfo || [];
	const user = users.find(u => {
		if (!u.name) return false;
		const fullName = u.name.trim().toLowerCase().replace(/\s+/g, " ");
		return fullName === targetName;
	});
	return user ? user.id : null;
}

async function getTargetUser(api, event, args, Users) {
	let targetID;
	let targetName;

	if (event.type === "message_reply") {
		targetID = event.messageReply.senderID;
	} else if (args[0]) {
		if (args[0].indexOf(".com/") !== -1) {
			targetID = await api.getUID(args[0]);
		} else if (args.join().includes("@")) {
			targetID = Object.keys(event.mentions || {})[0];
			if (!targetID) {
				targetID = await getUIDByFullName(api, event.threadID, args.join(" "));
			}
		} else {
			targetID = args[0];
		}
	}

	if (targetID) {
		targetName = await Users.getNameUser(targetID);
	}

	return { targetID, targetName };
}

module.exports.run = async ({ event, api, Users, args }) => {
	const { threadID, messageID } = event;

	if (args[0] === "on") {
		global.data.globalBan = true;
		return api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚫 𝐆𝐋𝐎𝐁𝐀𝐋 𝐁𝐀𝐍 𝐎𝐍!
» 🔒 সব ইউজারকে 
» 😹 ব্যান করা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
			threadID,
			messageID
		);
	}

	if (args[0] === "off" && !args[1]) {
		global.data.globalBan = false;
		return api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ 𝐆𝐋𝐎𝐁𝐀𝐋 𝐁𝐀𝐍 𝐎𝐅𝐅!
» 🔓 সব ইউজারকে 
» 😑 আনব্যান করা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
			threadID,
			messageID
		);
	}

	if (args[0] === "off" && args[1]) {
		const { targetID, targetName } = await getTargetUser(api, event, [args[1]], Users);
		
		if (!targetID) {
			return api.sendMessage(
				`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ভুল ইনপুট সঠিক ইউজার 
» 🙃 আইডিলিংক বা মেনশন দিন।
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
				threadID,
				messageID
			);
		}

		let data = (await Users.getData(targetID)).data || {};
		data.banned = 0;

		await Users.setData(targetID, { data });
		global.data.userBanned.delete(targetID);

		const name = targetName || await Users.getNameUser(targetID);

		return api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔓 𝐔𝐒𝐄𝐑 𝐔𝐍𝐁𝐀𝐍𝐍𝐄𝐃!
» 👤 𝐍𝐚𝐦𝐞: ${name}
» 🆔 𝐔𝐈𝐃: ${targetID}
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
			threadID,
			messageID
		);
	}

	if (args[0] === "list") {
		const banned = Array.from(global.data.userBanned.entries());

		if (banned.length === 0)
			return api.sendMessage(
				`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❎ বর্তমানে কোনো 
» 🔔 ব্যান লিস্ট নেই!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
				threadID,
				messageID
			);

		let msg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📌 𝐁𝐀𝐍𝐍𝐄𝐃 𝐔𝐒𝐄𝐑𝐒 𝐋𝐈𝐒𝐓:\n\n`;
		let i = 1;

		for (const [uid] of banned) {
			const name = await Users.getNameUser(uid);
			msg += `${i}. 👤 ${name}\n   🆔 ${uid}\n`;
			i++;
		}

		msg += `───────────────\n» 👈 Unban করতে চাইলে এই\n» 🤗 মেসেজে রিপ্লাই দিয়ে নাম্বার লিখুন।\n───────────────\n»» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`;

		return api.sendMessage(msg, threadID, (err, info) => {
			global.client.handleReply.push({
				name: "ban",
				messageID: info.messageID,
				author: event.senderID,
				banned
			});
		});
	}

	const { targetID, targetName } = await getTargetUser(api, event, args, Users);

	if (!targetID) {
		return api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ সঠিক কমান্ড ব্যবহার করুন!
» 💡 উদাহরণ: ban @mention  
» ⛱️ reply UID
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
			threadID,
			messageID
		);
	}

	if (global.data.userBanned.has(targetID)) {
		return api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ ${targetName || targetID} 
» 😭 আগে থেকেই ব্যান রয়েছে!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
			threadID,
			messageID
		);
	}

	if (global.utils.guardAdminBan(api, targetID, threadID, messageID)) return;

	let data = (await Users.getData(targetID)).data || {};

	data.banned = 1;
	data.reason = "Manual BAN";
	data.dateAdded = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Dhaka"
	});

	await Users.setData(targetID, { data });

	global.data.userBanned.set(targetID, {
		reason: data.reason,
		dateAdded: data.dateAdded
	});

	const name = targetName || await Users.getNameUser(targetID);

	return api.sendMessage(
		`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚫 𝐔𝐒𝐄𝐑 𝐁𝐀𝐍𝐍𝐄𝐃!
» 👤 𝐍𝐚𝐦𝐞: ${name}
» 🆔 𝐔𝐈𝐃: ${targetID}
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
		threadID,
		messageID
	);
};

module.exports.handleReply = async ({ event, api, Users, handleReply }) => {
	if (event.senderID != handleReply.author) return;

	const index = parseInt(event.body);
	if (isNaN(index)) return;

	const user = handleReply.banned[index - 1];
	if (!user)
		return api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ভুল নাম্বার 
» 🙁 নির্বাচন করেছেন!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
			event.threadID
		);

	const uid = user[0];

	let data = (await Users.getData(uid)).data || {};
	data.banned = 0;

	await Users.setData(uid, { data });
	global.data.userBanned.delete(uid);

	const name = await Users.getNameUser(uid);

	return api.sendMessage(
		`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔓 𝐔𝐒𝐄𝐑 𝐔𝐍𝐁𝐀𝐍𝐍𝐄𝐃!
» 👤 𝐍𝐚𝐦𝐞: ${name}
» 🆔 𝐔𝐈𝐃: ${uid}
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
		event.threadID
	);
};
