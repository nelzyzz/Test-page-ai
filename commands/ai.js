// commands/ai.js
const axios = require('axios');

const config = {
    name: "ai",
    aliases: ["ai"],
    description: "Interact with the GPT-4 API or analyze images",
    usage: "[query]",
    cooldown: 5,
    permissions: [0],
    credits: "Coffee",
};

async function onCall({ message, args }) {
    const query = args.join(" ") || "hi";
    const userId = message.senderID;
    const header = "(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠) | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n・──────────────・";
    const footer = "・───── >ᴗ< ──────・";

    if (message.messageReply?.attachments?.[0]?.type === "photo") {
        const imageURL = message.messageReply.attachments[0].url;
        const geminiUrl = `https://joncll.serv00.net/chat.php?ask=${encodeURIComponent(query)}&imgurl=${encodeURIComponent(imageURL)}`;
        try {
            const { data } = await axios.get(geminiUrl);
            return message.reply(`${header}\n${data.vision || 'Failed to recognize the image.'}\n${footer}`);
        } catch (error) {
            console.error("Error:", error);
            return message.reply(`${header}\nError processing image.\n${footer}`);
        }
    }

    try {
        const { data } = await axios.get(`https://lorex-gpt4.onrender.com/api/gpt4?prompt=${encodeURIComponent(query)}&uid=${userId}`);
        return message.reply(`${header}\n${data.response || 'No response from API.'}\n${footer}`);
    } catch (error) {
        console.error("Error:", error);
        return message.reply(`${header}\nError reaching API.\n${footer}`);
    }
}

module.exports = {
    config,
    onCall,
};
