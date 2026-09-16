module.exports.config = {
	name: "gcadmin",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "Add/remove admin via me, mention, or reply",
	commandCategory: "system",
	usages: "boxadmin me | boxadmin add/remove [@mention/reply/UID/link/name]",
	cooldowns: 5
};

const cleanName = (name) => {
	if (!name) return null;
	return name.replace(/\s+/g, " ").trim();
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

async function getTargetUser(api, event, args) {
	let uid;
	
	if (args[0]?.toLowerCase() === "me") {
		return { uid: event.senderID, action: "add" };
	}
	
	const action = args[0]?.toLowerCase();
	if (!action || !["add", "remove"].includes(action)) {
		return { uid: null, action: null };
	}
	
	const targetArg = args.slice(1).join(" ");
	
	if (event.type === "message_reply") {
		uid = event.messageReply.senderID;
	} else if (targetArg) {
		if (targetArg.indexOf(".com/") !== -1) {
			uid = await api.getUID(targetArg);
		} else if (targetArg.includes("@")) {
			uid = Object.keys(event.mentions || {})[0];
			if (!uid) {
				uid = await getUIDByFullName(api, event.threadID, targetArg);
			}
		} else {
			uid = targetArg;
		}
	}
	
	return { uid, action };
}

module.exports.run = async function({ api, event, args }) {
	const threadID = event.threadID;
	const botID = api.getCurrentUserID();

	try {
		const { uid, action } = await getTargetUser(api, event, args);
		
		if (args[0]?.toLowerCase() === "me") {
			const meUid = event.senderID;
			
			const userInfo = await api.getUserInfo([meUid]);
			const senderName = cleanName(userInfo[meUid]?.name) || "আপনি";
			
			const threadInfo = await api.getThreadInfo(threadID);
			const botIsAdmin = threadInfo.adminIDs.some(admin => admin.id == botID);
			const targetIsAdmin = threadInfo.adminIDs.some(admin => admin.id == meUid);
			
			if (!botIsAdmin) 
				return api.sendMessage(
					`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ এই কমান্ড ব্যবহার 
» ☎️ করতে আমাকে আগে 
» 💿bগ্রুপের এডমিন বানান!
───────────────
»» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
					threadID,
					event.messageID
				);
			
			if (targetIsAdmin) 
				return api.sendMessage(
					`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ ${senderName} 
» 🦭 আপনি আগে থেকেই 
» 🤩 গ্রুপের এডমিন আছেন!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
					threadID,
					event.messageID
				);
			
			await api.changeAdminStatus(threadID, meUid, true);
			return api.sendMessage(
				`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 ${senderName} 
» 🕊️ নিজেকে সফলভাবে 
» 👋 এডমিন বানিয়েছেন!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
				threadID,
				event.messageID
			);
		}
		
		if (!action || !["add", "remove"].includes(action)) {
			return api.sendMessage(
				`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ভুল কমান্ড ব্যবহার করেছেন!
» 💡 𝐔𝐬𝐚𝐠𝐞:
• gcadmin me
• gcadmin add [@mention_reply_UID_link_name]
• gcadmin remove [@mention_reply_UID_link_name]
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
				threadID,
				event.messageID
			);
		}
		
		if (!uid) {
			return api.sendMessage(
				`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ কাকে এডমিন করতে চান 
» 🤗 তা চিহ্নিত করতে পারেন নি!
» 💡 মেনশন রিপ্লাই ইউআইডি বা 
» 👰 ফেসবুক প্রোফাইল লিংক দিন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
				threadID,
				event.messageID
			);
		}
		
		const userInfo = await api.getUserInfo([uid, event.senderID]);
		
		const senderName = cleanName(userInfo[event.senderID]?.name) || "আপনি";
		const targetName = cleanName(userInfo[uid]?.name) || "User";
		
		const threadInfo = await api.getThreadInfo(threadID);
		const botIsAdmin = threadInfo.adminIDs.some(admin => admin.id == botID);
		const targetIsAdmin = threadInfo.adminIDs.some(admin => admin.id == uid);
		
		if (!botIsAdmin) 
			return api.sendMessage(
				`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ এই কমান্ড ব্যবহার 
» 🌮 করার জন্য আগে 
» 🥙 আমাকে গ্রুপের এডমিন দিন!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
				threadID,
				event.messageID
			);
		
		if (action === "add") {
			if (targetIsAdmin) 
				return api.sendMessage(
					`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ ${targetName} 
» 🙁আগে থেকেই গ্রুপের 
» 😭 এডমিন রয়েছেন!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
					threadID,
					event.messageID
				);
			
			await api.changeAdminStatus(threadID, uid, true);
			if (uid === event.senderID) 
				return api.sendMessage(
					`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 ${senderName} 
» 🧑‍🔬 নিজেকে এডমিন 
» 🎉 বানিয়েছেন!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
					threadID,
					event.messageID
				);
			else 
				return api.sendMessage(
					`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 ${senderName}, ${targetName}-
» 🥱 কে সফলভাবে 
» 🐼 এডমিন বানিয়েছেন!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
					threadID,
					event.messageID
				);
			
		} else if (action === "remove") {
			if (!targetIsAdmin) 
				return api.sendMessage(
					`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ${targetName} 
» 🫶 এই গ্রুপের এডমিন নন!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
					threadID,
					event.messageID
				);
			
			await api.changeAdminStatus(threadID, uid, false);
			if (uid === event.senderID) 
				return api.sendMessage(
					`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🗑️ ${senderName} 
»🎉 নিজেকে এডমিন থেকে 
» 💔 রিমুভ করেছেন!
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
					threadID,
					event.messageID
				);
			else 
				return api.sendMessage(
					`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🗑️ ${targetName}-
» 🐸 কে এডমিন থেকে 
» 🌝 রিমুভ করা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
					threadID,
					event.messageID
				);
		}
		
	} catch (e) {
		console.error(e);
		return api.sendMessage(
			`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐄𝐫𝐫𝐨𝐫: ${e.message}
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`,
			threadID,
			event.messageID
		);
	}
};
