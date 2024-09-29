const { getDirective, setDirective } = require("../directives");
const { cancelKeyboard } = require("../keyboards/cancelKeyboard");
const { toAdminMenuKeyboard } = require("../keyboards/toAdminMenuKeyboard");
const { toMainMenuKeyboard } = require("../keyboards/toMainMenuKeyboard");
const { getGPTanswer, replyWithWordDocument } = require("../services");

const gptCorrection = async (conversation, ctx) => {
	const question = await ctx.reply("Введите текст для проверки", {
		reply_markup: cancelKeyboard,
	});
	const messageCtx = await conversation.wait();
	const message = messageCtx.message?.text;
	if (!message) {
		try {
			await messageCtx.msg.delete();
		} catch (error) {}
		await ctx.reply("Операция отменена", {
			reply_markup: toMainMenuKeyboard(),
		});
		return;
	} else {
		ctx.api.sendChatAction(ctx.chat.id, "typing");
		const response = await getGPTanswer(message, await getDirective("correction"));
		await replyWithWordDocument(response, ctx, message, "correction");

		try {
			ctx.api.deleteMessage(question.chat.id, question.message_id);
		} catch (error) {}
	}
};

const vocabBooster = async (conversation, ctx) => {
	const question = await ctx.reply(
		"Введите текст, в котором вы хотите повысить уровень лексики",
		{
			reply_markup: cancelKeyboard,
		}
	);
	const messageCtx = await conversation.wait();
	const message = messageCtx.message?.text;
	if (!message) {
		try {
			await messageCtx.msg.delete();
		} catch (error) {}
		await ctx.reply("Операция отменена", {
			reply_markup: toMainMenuKeyboard(),
		});
		return;
	} else {
		ctx.api.sendChatAction(ctx.chat.id, "typing");
		const response = await getGPTanswer(message, await getDirective("vocab_booster"));
		await replyWithWordDocument(response, ctx, message, "vocab_booster");
		try {
			ctx.api.deleteMessage(question.chat.id, question.message_id);
		} catch (error) {}
	}
};

const essayUpgrade = async (conversation, ctx) => {
	const question = await ctx.reply(
		"Введите сообщение, в котором первой строчкой будет тема эссе, а затем текст",
		{
			reply_markup: cancelKeyboard,
		}
	);
	const messageCtx = await conversation.wait();
	const message = messageCtx.message?.text;
	if (!message) {
		try {
			await messageCtx.msg.delete();
		} catch (error) {}
		await ctx.reply("Операция отменена", {
			reply_markup: toMainMenuKeyboard(),
		});
		return;
	} else {
		ctx.api.sendChatAction(ctx.chat.id, "typing");
		const response = await getGPTanswer(
			message,
			await getDirective("IELTS_essay_upgrade")
		);
		await replyWithWordDocument(response, ctx, message, "IELTS_essay_upgrade");
		try {
			ctx.api.deleteMessage(question.chat.id, question.message_id);
		} catch (error) {}
	}
};

const changeCorrectionPrompt = async (conversation, ctx) => {
	const question = await ctx.reply("Введите новый промпт", {
		reply_markup: cancelKeyboard,
	});
	const messageCtx = await conversation.wait();
	const message = messageCtx.message?.text;
	if (!message) {
		try {
			await messageCtx.msg.delete();
		} catch (error) {}
		await ctx.reply("Операция отменена", {
			reply_markup: toAdminMenuKeyboard,
		});
		return;
	} else {
		await setDirective("correction", message);
		ctx.reply("Промпт изменен", {
			reply_markup: toAdminMenuKeyboard,
		});
		try {
			ctx.api.deleteMessage(question.chat.id, question.message_id);
		} catch (error) {}
	}
};
const changeVocabBoosterPrompt = async (conversation, ctx) => {
	const question = await ctx.reply("Введите новый промпт", {
		reply_markup: cancelKeyboard,
	});
	const messageCtx = await conversation.wait();
	const message = messageCtx.message?.text;
	if (!message) {
		try {
			await messageCtx.msg.delete();
		} catch (error) {}
		await ctx.reply("Операция отменена", {
			reply_markup: toAdminMenuKeyboard,
		});
		return;
	} else {
		await setDirective("vocab_booster", message);
		ctx.reply("Промпт изменен", {
			reply_markup: toAdminMenuKeyboard,
		});
		try {
			ctx.api.deleteMessage(question.chat.id, question.message_id);
		} catch (error) {}
	}
};

const changeEssayUpgraderPrompt = async (conversation, ctx) => {
	const question = await ctx.reply("Введите новый промпт", {
		reply_markup: cancelKeyboard,
	});
	const messageCtx = await conversation.wait();
	const message = messageCtx.message?.text;
	if (!message) {
		try {
			await messageCtx.msg.delete();
		} catch (error) {}
		await ctx.reply("Операция отменена", {
			reply_markup: toAdminMenuKeyboard,
		});
		return;
	} else {
		await setDirective("IELTS_essay_upgrade", message);
		ctx.reply("Промпт изменен", {
			reply_markup: toAdminMenuKeyboard,
		});
		try {
			ctx.api.deleteMessage(question.chat.id, question.message_id);
		} catch (error) {}
	}
};

module.exports = {
	gptCorrection,
	vocabBooster,
	essayUpgrade,
	changeCorrectionPrompt,
	changeVocabBoosterPrompt,
	changeEssayUpgraderPrompt,
};
