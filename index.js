const { bot } = require("./bot");
const startHandler = require("./handlers/startHandler");
const adminHandler = require("./handlers/adminHandler");
const { toMainMenu, toAdminMenu, toOwnerMenu } = require("./routes");
const ownerHandler = require("./handlers/ownerHandler");
const { separate, isChatMember } = require("./services");
const { votePollHandler } = require("./handlers/votePollHandler");
const AIHandler = require("./handlers/AIHandler");
const photoHandler = require("./handlers/photoHandler");
const { getAdminPassword, getOwnerPassword } = require("./db");

bot.command("start", (ctx) => startHandler(ctx));
bot.command("chat_id", async (ctx) => {
	ctx.msg.delete();
	ctx.reply(ctx.chat.id);
});

bot.callbackQuery("toMenu", async (ctx) => {
	toMainMenu(ctx);
	ctx.answerCallbackQuery();
});
bot.callbackQuery("toAdminMenu", async (ctx) => {
	toAdminMenu(ctx);
	ctx.answerCallbackQuery();
});
bot.callbackQuery("toOwnerMenu", async (ctx) => {
	toOwnerMenu(ctx);
	ctx.answerCallbackQuery();
});
bot.callbackQuery("ok", async (ctx) => {
	ctx.answerCallbackQuery();
});
bot.callbackQuery("cancel", async (ctx) => {
	try {
		ctx.msg.delete();
	} catch (error) {}
	ctx.conversation.exit();
	ctx.answerCallbackQuery();
});

bot.on(":text", async (ctx) => {
	const text = ctx.msg.text;
	switch (text) {
		case await getAdminPassword():
			await adminHandler(ctx);
			break;
		case await getOwnerPassword():
			await ownerHandler(ctx);
			break;
		default:
			await AIHandler(ctx);
			break;
	}
});

bot.on("message", async (ctx) => {
	console.log(ctx.chat);
});


bot.callbackQuery(/-/, async (ctx) => {
	const { itemName, action } = separate(ctx);
	switch (action) {
		case "pref":
			try {
				votePollHandler(ctx, itemName);
			} catch (error) {}
			break;

		default:
			break;
	}
	ctx.answerCallbackQuery();
});

bot.catch((err) => {
	console.log(err)
	bot.start();
});
bot.start();
