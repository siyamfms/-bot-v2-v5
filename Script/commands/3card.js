module.exports.config = {
	name: "3card",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
	description: "𝐍𝐈𝐉𝐇𝐔𝐌-𝐁𝐎𝐓 Three Card Game with betting system",
	commandCategory: "Game",
	usages: "[create/join/start/info/leave]",
	cooldowns: 1
};

const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const suits = ["spades", "hearts", "diamonds", "clubs"];
const deck = [];

for (let i = 0; i < values.length; i++) {
	for (let x = 0; x < suits.length; x++) {
		let weight = parseInt(values[i]);
		if (["J", "Q", "K"].includes(values[i])) weight = 10;
		else if (values[i] == "A") weight = 11;

		const card = {
			Value: values[i],
			Suit: suits[x],
			Weight: weight,
			Icon: suits[x] == "spades" ? "♠️" : suits[x] == "hearts" ? "♥️" : suits[x] == "diamonds" ? "♦️" : "♣️"
		};
		deck.push(card);
	}
}

function createDeck() {
	const deckShuffled = [...deck];
	for (let i = 0; i < 1000; i++) {
		const loc1 = Math.floor(Math.random() * deckShuffled.length);
		const loc2 = Math.floor(Math.random() * deckShuffled.length);
		const tmp = deckShuffled[loc1];
		deckShuffled[loc1] = deckShuffled[loc2];
		deckShuffled[loc2] = tmp;
	}
	return deckShuffled;
}

function getCardLink(Value, Suit) {
	return `https://raw.githubusercontent.com/ntkhang03/poker-cards/main/cards/${Value == "J" ? "jack" : Value == "Q" ? "queen" : Value == "K" ? "king" : Value == "A" ? "ace" : Value}_of_${Suit}.png`;
}

async function drawCard(cards) {
	const Canvas = require("canvas");
	const canvas = Canvas.createCanvas(500 * cards.length, 726);
	const ctx = canvas.getContext("2d");
	let x = 0;
	for (const card of cards) {
		const img = await Canvas.loadImage(card);
		ctx.drawImage(img, x, 0);
		x += 500;
	}
	return canvas.toBuffer();
}

module.exports.handleEvent = async ({ Currencies, event, api, Users }) => {
	const Canvas = require("canvas");
	const fs = require("fs-extra");
	const { senderID, threadID, body, messageID } = event;

	if (!body) return;
	if (!global.moduleData.threecards) global.moduleData.threecards = new Map();
	if (!global.moduleData.threecards.has(threadID)) return;

	const values = global.moduleData.threecards.get(threadID);
	if (values.start != 1) return;

	const deckShuffled = values.deckShuffled;

	if (body.toLowerCase().startsWith("deal cards")) {
		if (values.dealt == 1) return;
		for (const key in values.player) {
			const card1 = deckShuffled.shift();
			const card2 = deckShuffled.shift();
			const card3 = deckShuffled.shift();

			let total = card1.Weight + card2.Weight + card3.Weight;
			if (total >= 20) total -= 20;
			if (total >= 10) total -= 10;

			values.player[key].card1 = card1;
			values.player[key].card2 = card2;
			values.player[key].card3 = card3;
			values.player[key].total = total;

			const cardLinks = [];
			for (let i = 1; i <= 3; i++) {
				const c = values.player[key]["card" + i];
				cardLinks.push(getCardLink(c.Value, c.Suit));
			}

			const pathSave = __dirname + `/cache/card${values.player[key].id}.png`;
			fs.writeFileSync(pathSave, await drawCard(cardLinks));

			api.sendMessage({
				body: `আপনার কার্ড: ${card1.Value}${card1.Icon} | ${card2.Value}${card2.Icon} | ${card3.Value}${card3.Icon}\n\nমোট পয়েন্ট: ${total}`,
				attachment: fs.createReadStream(pathSave)
			}, values.player[key].id, (err) => {
				if (err) return api.sendMessage(`কার্ড পাঠানো সম্ভব হয়নি: ${values.player[key].id}`, threadID);
				fs.unlinkSync(pathSave);
			});
		}

		values.dealt = 1;
		global.moduleData.threecards.set(threadID, values);
		return api.sendMessage("কার্ড বিতরণ সম্পন্ন হয়েছে! প্রতি প্লেয়ার ২ বার কার্ড পরিবর্তন (Swap) করতে পারবেন।", threadID);
	}

	if (body.toLowerCase().startsWith("swap card")) {
		if (values.dealt != 1) return;
		const player = values.player.find(p => p.id == senderID);
		if (player.swaps == 0) return api.sendMessage("আপনার কার্ড পরিবর্তনের সুযোগ শেষ হয়ে গেছে।", threadID, messageID);
		if (player.ready) return api.sendMessage("আপনি ইতিমধ্যে তৈরি। আর পরিবর্তন করা যাবে না।", threadID, messageID);

		const cards = ["card1", "card2", "card3"];
		player[cards[Math.floor(Math.random() * cards.length)]] = deckShuffled.shift();
		player.total = player.card1.Weight + player.card2.Weight + player.card3.Weight;
		if (player.total >= 20) player.total -= 20;
		if (player.total >= 10) player.total -= 10;
		player.swaps -= 1;
		global.moduleData.threecards.set(threadID, values);

		const cardLinks = [];
		for (let i = 1; i <= 3; i++) {
			const c = player["card" + i];
			cardLinks.push(getCardLink(c.Value, c.Suit));
		}

		const pathSave = __dirname + `/cache/card${player.id}.png`;
		fs.writeFileSync(pathSave, await drawCard(cardLinks));

		return api.sendMessage({
			body: `পরিবর্তনের পর আপনার কার্ড: ${player.card1.Value}${player.card1.Icon} | ${player.card2.Value}${player.card2.Icon} | ${player.card3.Value}${player.card3.Icon}\nমোট পয়েন্ট: ${player.total}`,
			attachment: fs.createReadStream(pathSave)
		}, player.id, (err) => {
			if (err) return api.sendMessage(`কার্ড পরিবর্তন করা যায়নি: ${player.id}`, threadID);
			fs.unlinkSync(pathSave);
		});
	}

	if (body.toLowerCase().startsWith("ready")) {
		if (values.dealt != 1) return;
		const player = values.player.find(p => p.id == senderID);
		if (player.ready) return;

		values.ready += 1;
		player.ready = true;

		if (values.player.length == values.ready) {
			const players = values.player;
			players.sort((a, b) => b.total - a.total);

			let ranking = [], rank = 1;
			for (const p of players) {
				const name = await Users.getNameUser(p.id);
				ranking.push(`${rank++} • ${name} : ${p.card1.Value}${p.card1.Icon} | ${p.card2.Value}${p.card2.Icon} | ${p.card3.Value}${p.card3.Icon} => ${p.total} পয়েন্ট`);
			}

			try {
				await Currencies.increaseMoney(players[0].id, values.betAmount * players.length);
			} catch (e) {}
			global.moduleData.threecards.delete(threadID);

			return api.sendMessage(`ফলাফল:\n\n${ranking.join("\n")}\n\nপ্রথম স্থান অধিকারী বিজয়ী জিতেছেন: ${values.betAmount * players.length}$`, threadID);
		} else {
			const name = await Users.getNameUser(player.id);
			return api.sendMessage(`${name} তৈরি আছেন। বাকি প্লেয়ার তৈরি হওয়া বাকি: ${values.player.length - values.ready}`, threadID);
		}
	}

	if (body.toLowerCase().startsWith("nonready")) {
		const notReady = values.player.filter(p => !p.ready);
		if (notReady.length == 0) return;
		const msg = [];
		for (const p of notReady) {
			const name = global.data.userName.get(p.id) || await Users.getNameUser(p.id);
			msg.push(name);
		}
		return api.sendMessage("যারা এখনো তৈরি নন: " + msg.join(", "), threadID);
	}
}

module.exports.run = async ({ api, event, args, Currencies }) => {
	const { senderID, threadID, messageID } = event;
	const fs = require("fs-extra");
	const request = require("request");
	const path = __dirname + "/cache/3cards.png";

	if (!fs.existsSync(path)) {
		request('https://i.imgur.com/MXk2py3.png').pipe(fs.createWriteStream(path));
	}

	if (!global.moduleData.threecards) global.moduleData.threecards = new Map();
	const values = global.moduleData.threecards.get(threadID) || {};
	const data = await Currencies.getData(senderID);
	const money = data.money;

	if (!args[0]) {
		return api.sendMessage({
			body: `===== 3 Card Table (𝐍𝐈𝐉𝐇𝐔𝐌-𝐁𝐎𝐓) =====\nথ্রি কার্ড গেম টেবিলে স্বাগতম!\n\nকমান্ড তালিকা:\n» 3card create [বাজির পরিমাণ]\n» 3card join\n» 3card start\n» 3card info\n» 3card leave\n» Deal Cards (খেলার হোস্টের জন্য)\n» Swap Card (কার্ড বদলানোর জন্য)\n» Ready (কার্ড প্রকাশের জন্য তৈরি হতে)\n» Nonready (যারা তৈরি নন তাদের তালিকা)`,
			attachment: fs.createReadStream(path)
		}, threadID, messageID);
	}

	switch (args[0]) {
		case "create":
		case "-c": {
			if (global.moduleData.threecards.has(threadID)) return api.sendMessage("এই গ্রুপে ইতিমধ্যে একটি ৩ কার্ড টেবিল তৈরি আছে।", threadID, messageID);
			if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 1) return api.sendMessage("সঠিক বাজির পরিমাণ লিখুন।", threadID, messageID);
			if (money < args[1]) return api.sendMessage(`এই টেবিলটি তৈরি করার মতো পর্যাপ্ত টাকা আপনার নেই: ${args[1]}$`, threadID, messageID);

			await Currencies.decreaseMoney(senderID, Number(args[1]));
			global.moduleData.threecards.set(threadID, {
				author: senderID,
				start: 0,
				dealt: 0,
				ready: 0,
				player: [{ id: senderID, card1: 0, card2: 0, card3: 0, swaps: 2, ready: false }],
				betAmount: Number(args[1])
			});
			return api.sendMessage(`৩ কার্ড টেবিল তৈরি হয়েছে! বাজির পরিমাণ: ${args[1]}$। অন্য সদস্যরা যুক্ত হতে পারেন।`, threadID, messageID);
		}

		case "join":
		case "-j": {
			if (!values || Object.keys(values).length === 0) return api.sendMessage("এখনো কোনো ৩ কার্ড টেবিল তৈরি করা হয়নি।", threadID, messageID);
			if (values.start === 1) return api.sendMessage("খেলা ইতিমধ্যে শুরু হয়ে গেছে।", threadID, messageID);
			if (money < values.betAmount) return api.sendMessage(`টেবিলে যুক্ত হওয়ার মতো পর্যাপ্ত টাকা নেই: ${values.betAmount}$`, threadID, messageID);
			if (values.player.find(p => p.id === senderID)) return api.sendMessage("আপনি ইতিমধ্যে টেবিলে যুক্ত আছেন।", threadID, messageID);

			values.player.push({ id: senderID, card1: 0, card2: 0, card3: 0, total: 0, swaps: 2, ready: false });
			await Currencies.decreaseMoney(senderID, values.betAmount);
			global.moduleData.threecards.set(threadID, values);
			return api.sendMessage("আপনি সফলভাবে ৩ কার্ড টেবিলে যুক্ত হয়েছেন!", threadID, messageID);
		}

		case "leave":
		case "-l": {
			if (!values || !values.player || values.player.length === 0) return api.sendMessage("এই গ্রুপে কোনো ৩ কার্ড টেবিল নেই।", threadID, messageID);
			if (!values.player.some(p => p.id === senderID)) return api.sendMessage("আপনি এই টেবিলে যুক্ত নেই।", threadID, messageID);
			if (values.start === 1) return api.sendMessage("খেলা শুরু হয়ে গেছে, এখন টেবিল ছাড়তে পারবেন না।", threadID, messageID);

			if (values.author === senderID) {
				global.moduleData.threecards.delete(threadID);
				return api.sendMessage("খেলার তৈরি করে যাওয়া ব্যক্তি টেবিল ছেড়েছেন। তাই টেবিল বন্ধ করা হলো।", threadID, messageID);
			} else {
				values.player = values.player.filter(p => p.id !== senderID);
				global.moduleData.threecards.set(threadID, values);
				return api.sendMessage("আপনি ৩ কার্ড টেবিল থেকে বের হয়ে গেছেন।", threadID, messageID);
			}
		}

		case "start":
		case "-s": {
			if (!values || Object.keys(values).length === 0) return api.sendMessage("এখনো কোনো ৩ কার্ড টেবিল তৈরি করা হয়নি।", threadID, messageID);
			if (values.author !== senderID) return api.sendMessage("শুধুমাত্র টেবিলের মূল উদ্যোক্তা খেলা শুরু করতে পারবেন।", threadID, messageID);
			if (values.player.length <= 1) return api.sendMessage("খেলা শুরু করতে অন্তত ২ জন খেলোয়াড় প্রয়োজন।", threadID, messageID);
			if (values.start === 1) return api.sendMessage("খেলা ইতিমধ্যে শুরু হয়ে গেছে।", threadID, messageID);

			values.deckShuffled = createDeck();
			values.start = 1;
			global.moduleData.threecards.set(threadID, values);
			return api.sendMessage("৩ কার্ড খেলা শুরু হয়েছে! টেবিল প্রস্তুতকর্তা Deal Cards মেসেজ পাঠাতে পারেন।", threadID, messageID);
		}

		case "info":
		case "-i": {
			if (!values || !values.player || values.player.length === 0) return api.sendMessage("এই গ্রুপে কোনো ৩ কার্ড টেবিল নেই।", threadID, messageID);
			return api.sendMessage(
				`===== 3 Card Table Info =====\n- উদ্যোক্তা ID: ${values.author}\n- মোট খেলোয়াড়: ${values.player.length}\n- বাজির পরিমাণ: ${values.betAmount}$`,
				threadID,
				messageID
			);
		}

		default:
			return api.sendMessage("ভুল কমান্ড! ব্যবহার করুন: 3card create, join, leave, start, info", threadID, messageID);
	}
};
