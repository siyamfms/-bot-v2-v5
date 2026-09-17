module.exports.config = {
  name: "cover",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Create an interesting banner image",
  commandCategory: "Create a photo",
  usages: "cover [text1 - text2]",
  cooldowns: 10,
  dependencies: {
    canvas: "",
    axios: "",
    "fs-extra": ""
  }
};

module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
};

module.exports.run = async function ({ api, event, args, Users }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + `/cache/${senderID}.png`;
  let pathAva = __dirname + `/cache/avtuser.png`;
  let text = args.join(" ");
  if (!text) return api.sendMessage('💢Please enter the correct format [text1 - text2] ', event.threadID, event.messageID);
  const text1 = text.substr(0, text.indexOf(' - ')); 
  if (!text1) return api.sendMessage('💢Please enter the correct format [text1 - text2] ', event.threadID, event.messageID);
  const text2 = text.split(" - ").pop();
  if (!text2) return api.sendMessage('💢Please enter the correct format [text1 - text2] ', event.threadID, event.messageID);
  let Avatar = (
    await axios.get(
      `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  let getWanted = (
    await axios.get(encodeURI(`https://i.ibb.co/cCpB1sQ/Ph-i-b-a-trung-thu.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
  let avatar = await this.circle(pathAva);
  fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));
  let baseImage = await loadImage(pathImg);
  let baseAva = await loadImage(avatar);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, 1920, 1080);
  ctx.drawImage(baseAva, 820, 315, 283, 283);
  ctx.font = "bold 70px Manrope";
  ctx.fillStyle = "#ffff";
  ctx.textAlign = "center";
  ctx.fillText(text1, 965, 715);
  ctx.font = "55px Manrope";
  ctx.fillStyle = "#ffff";
  ctx.textAlign = "center";
  ctx.fillText(text2, 965, 800);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAva);
  return api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
