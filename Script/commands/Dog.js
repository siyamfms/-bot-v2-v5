module.exports.config = {
  name: "dog",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Random dog image generator",
  commandCategory: "Picture",
  usages: "dog",
  cooldowns: 1
};

module.exports.run = async ({ api, event }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");

  axios.get('https://nekos.life/api/v2/img/woof').then(res => {
    let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);

    let callback = function () {
      api.sendMessage({
        body: "🧘 𝐍𝐈𝐉𝐇𝐔𝐌-𝐁𝐎𝐓🐒\n😑এইনে ভাই তর পিক😂",
        attachment: fs.createReadStream(__dirname + `/cache/dog.${ext}`)
      }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/dog.${ext}`), event.messageID);
    };

    request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/dog.${ext}`)).on("close", callback);
  }).catch(() => {
    api.sendMessage("An error occurred while fetching the image.", event.threadID, event.messageID);
  });
};
