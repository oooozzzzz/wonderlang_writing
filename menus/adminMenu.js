const { Menu } = require("@grammyjs/menu");

const { userGetsNotifications } = require("../db");
const { toggleNotifications } = require("../services");
const { getDirective } = require("../directives");

const adminMenu = new Menu("adminMenu")
	.text("Управление промптами", async (ctx) => {
		ctx.menu.nav("promptsMenu");
		await ctx.msg.editText("Выберите промпт");
	})
	.row()
	.text(
		(ctx) => ctx.t("close"),
		async (ctx) => {
			ctx.msg.delete();
		}
	);

const promptsMenu = new Menu("promptsMenu")
	.text("Correction", async (ctx) => {
		const prompt =await getDirective("correction");
		await ctx.msg.editText(`Текущий промт \n\n${prompt}`, {
			parse_mode: "HTML",
		});
		ctx.menu.nav("changeCorrectionMenu");
	})
	.row()
	.text("Vocabulary booster", async (ctx) => {
		const prompt = await getDirective("vocab_booster");
		await ctx.msg.editText(`Текущий промт \n\n${prompt}`, {
			parse_mode: "HTML",
		});
		ctx.menu.nav("changeVocabBoosterMenu");
	})
	.row()
	.text("IELTS essay upgrade", async (ctx) => {
		const prompt = await getDirective("IELTS_essay_upgrade");
		await ctx.msg.editText(`Текущий промт \n\n${prompt}`, {
			parse_mode: "HTML",
		});
		ctx.menu.nav("changeEssayUpgradeMenu");

	})
	.row()
	.text(
		(ctx) => ctx.t("back"),
		async (ctx) => {
			await ctx.msg.editText("Добро пожаловать в панель администратора");
			ctx.menu.nav("adminMenu");
		}
	);


const changeCorrectionMenu = new Menu("changeCorrectionMenu")
	.text("Изменить", async (ctx) => {
		await ctx.msg.delete();
		await ctx.conversation.enter("changeCorrectionPrompt");
	})
	.row()
	.text(
		(ctx) => ctx.t("back"),
		async (ctx) => {
			ctx.menu.nav("promptsMenu");
			await ctx.msg.editText("Выберите промпт");
		}
	);
const changeVocabBoosterMenu = new Menu("changeVocabBoosterMenu")
	.text("Изменить", async (ctx) => {
		await ctx.msg.delete();
		await ctx.conversation.enter("changeVocabBoosterPrompt");
	})
	.row()
	.text(
		(ctx) => ctx.t("back"),
		async (ctx) => {
			ctx.menu.nav("promptsMenu");
			await ctx.msg.editText("Выберите промпт");
		}
	);
const changeEssayUpgradeMenu = new Menu("changeEssayUpgradeMenu")
	.text("Изменить", async (ctx) => {
		await ctx.msg.delete();
		await ctx.conversation.enter("changeEssayUpgradePrompt");
	})
	.row()
	.text(
		(ctx) => ctx.t("back"),
		async (ctx) => {
			ctx.menu.nav("promptsMenu");
			await ctx.msg.editText("Выберите промпт");
		}
	);

adminMenu.register([promptsMenu, changeCorrectionMenu, changeVocabBoosterMenu, changeEssayUpgradeMenu]);

module.exports = { adminMenu };
