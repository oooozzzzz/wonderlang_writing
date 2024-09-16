const { Menu } = require("@grammyjs/menu");
const { myDiscountsMenu } = require("./myDiscountsMenu");
const { createWordDocument } = require("../services");

const startMenu = new Menu("startMenu")
	.text("Correction", async (ctx) => {
		ctx.msg.delete();
		await ctx.conversation.enter("gptCorrection");
	})
	.row()
	.text("Vocabularly booster", async (ctx) => {
		await ctx.msg.delete();
		await ctx.conversation.enter("vocabBooster");
	})
	.row()
	.text("IELTS essay upgrade", async (ctx) => {
		await ctx.msg.delete();
		await ctx.conversation.enter("essayUpgrade");
	});

const finishConversationMenu = new Menu("finishConversationMenu").back(
	"Продолжить работу с ботом"
);

const backToMenu = new Menu("finishConversationMenu").text(
	"Назад в меню",
	async (ctx) => {
		ctx.menu.nav("startMenu");
		await ctx.msg.editText(ctx.t("start"));
	}
);

startMenu.register([finishConversationMenu, backToMenu]);

module.exports = { startMenu, finishConversationMenu };
