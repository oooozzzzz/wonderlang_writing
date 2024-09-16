const { Menu } = require("@grammyjs/menu");
const { myDiscountsMenu } = require("./myDiscountsMenu");
const { createWordDocument, isChatMember } = require("../services");

const startMenu = new Menu("startMenu", { autoAnswer: false })
	.text("Correction", async (ctx) => {
		if (await isChatMember(-1002430837732, ctx.from.id, ctx)) {
			await ctx.msg.delete();
			await ctx.conversation.enter("gptCorrection");
		} else {
			await ctx.api.answerCallbackQuery(ctx.update.callback_query.id, {
				text: "У вас нет доступа",
				show_alert: true,
			});
		}
	})
	.row()
	.text("Vocabularly booster", async (ctx) => {
		if (await isChatMember(-1002430837732, ctx.from.id, ctx)) {
			await ctx.msg.delete();
			await ctx.conversation.enter("vocabBooster");
		} else {
			await ctx.api.answerCallbackQuery(ctx.update.callback_query.id, {
				text: "У вас нет доступа",
				show_alert: true,
			});
		}
	})
	.row()
	.text("IELTS essay upgrade", async (ctx) => {
		if (await isChatMember(-1002430837732, ctx.from.id, ctx)) {
			await ctx.msg.delete();
			await ctx.conversation.enter("essayUpgrade");
		} else {
			await ctx.api.answerCallbackQuery(ctx.update.callback_query.id, {
				text: "У вас нет доступа",
				show_alert: true,
			});
		}
		
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
