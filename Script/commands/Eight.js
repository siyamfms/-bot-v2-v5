const fs = require("fs");
const path = require("path");

const AUTHOR_LOCK = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports.config = {
  name: "night",
  version: "1.0.1",
  hasPermssion: 0,
  credits: AUTHOR_LOCK,
  description: "Auto responds to good night messages",
  commandCategory: "no prefix",
  usages: "Good night / good night / Gud night",
  cooldowns: 5
};

module.exports.handleEvent = function({ api, event }) {
  const { threadID, messageID, body } = event;
  
  if (!body) return;

  const text = body.toLowerCase();
  
  if (text.startsWith("good night") || text.startsWith("gud night") || text.startsWith("gud nini")) {
    const gifPath = path.join(__dirname, "cache", "night.gif");
    
    const msgText = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 😴 যা ভাগ এখান থেকে
───────────────
» 🧚‍♀️‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓`;

    const msg = {
      body: msgText
    };

    if (fs.existsSync(gifPath)) {
      msg.attachment = fs.createReadStream(gifPath);
    }

    api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😴", messageID, (err) => {}, true);
  }
};

module.exports.run = function({ api, event }) {

};
