const { InlineKeyboard, InputFile } = require("grammy");
const {
	getAllUsers,
	getUserActiveDiscounts,
	outdateDiscount,
	activateDiscount,
	getAdmins,
	getNotifiedUsers,
	notGetNotifications,
	getNotifications,
	userGetsNotifications,
} = require("./db");
const { toAdminMenuKeyboard } = require("./keyboards/toAdminMenuKeyboard");
const { toMainMenuKeyboard } = require("./keyboards/toMainMenuKeyboard");
const officegen = require("officegen");
const fs = require("fs");
const { client } = require("./openai");

module.exports.deleteNow = async (ctx) => {
	try {
		await ctx.msg.delete();
	} catch (error) {
		console.error(`Error deleting message: ${error.message}`);
	}
};

module.exports.deleteAfter = async (ctx, seconds) => {
	setTimeout(() => {
		ctx.msg.delete();
	}, seconds * 1000);
};

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
const copy = async (id, ctx) => {
	await delay(500);
	try {
		await ctx.message.copy(id);
		return true;
	} catch (error) {
		return false;
	}
};

const processUsersList = async (usersList, ctx, path, text, work) => {
	const sendDocument = async (id, ctx, path, text) => {
		await delay(500);
		try {
			await ctx.api.sendDocument(id, new InputFile(path), {
				caption: `#${ctx.from.first_name} #${work}`,
			});
			return true;
		} catch (error) {
			return false;
		}
	};
	for (let user in usersList) {
		await sendDocument(usersList[user].tg_id, ctx, path, text);
	}
};
module.exports.copyMessageToUsers = async (ctx) => {
	const usersList = await getAllUsers();

	const { success, failure, atAll } = await processUsersList(
		usersList,
		copy,
		ctx
	);
	await ctx.reply(
		`Всего отправлено сообщений пользователям: ${atAll}
Успешно: ${success}, с ошибками: ${failure}.`,
		{ reply_markup: toAdminMenuKeyboard }
	);
};

const sendWorkToAdmins = async (ctx, path, text, work) => {
	const usersList = await getNotifiedUsers();
	await processUsersList(usersList, ctx, path, text, work);
};

module.exports.separate = (ctx) => {
	const query = ctx.callbackQuery.data;
	const index = query.match(/-/).index;
	const itemName = query.slice(index + 1);
	const action = query.slice(0, index);
	return { itemName, action };
};

module.exports.toggleNotifications = async (id) => {
	(await userGetsNotifications(id))
		? await notGetNotifications(id)
		: await getNotifications(id);
};

module.exports.answersToKeyboard = (answers) => {
	answers = answers.split(", ");
	const labelDataPairs = answers.map((answer) => {
		return [answer, `pref-${answer}`];
	});
	console.log(labelDataPairs);
	const buttonRow = labelDataPairs.map(([label, data]) =>
		InlineKeyboard.text(label, data)
	);
	const keyboard = InlineKeyboard.from([buttonRow]);
	return keyboard;
};

module.exports.hasActiveDiscount = async (tg_id) => {
	const activeDiscounts = await getUserActiveDiscounts(tg_id);
	const res = activeDiscounts.length > 0;
	return res;
};

module.exports.generateDiscountsText = (discounts) => {
	if (discounts.length > 0) {
		return `Доступно скидок: <b>${discounts.length}</b>
		${discounts.map(
			(discount) =>
				`· Скидка в размере <u><b>${discount.value}</b> процентов</u> \n`
		)}\nСкидка будет действительна в течение 2 часов после активации. Просто покажи администратору сообщение, которое тебе пришлет бот.`;
	} else return `У вас нет доступных скидок`;
};

module.exports.toggleDiscount = async (id, ctx) => {
	let sec = 600;
	await activateDiscount(id);

	await delay(sec * 1000);
	await outdateDiscount(id);
	try {
		await ctx.msg.delete();
	} catch (error) {}
	await ctx.reply(
		"Ваша скидка истекла. Следите за обновлениями, чтобы получить еще больше выгоды!",
		{ reply_markup: toMainMenuKeyboard() }
	);
};

module.exports.getGPTanswer = async (text, command) => {
	const prompt = { role: "system", content: command };
	const message = {
		role: "user",
		content: [{ type: "text", text }],
	};
	const chatCompletion = await client.chat.completions.create({
		messages: [prompt, message],
		model: "gpt-4o-mini",
	});
	const response = chatCompletion.choices[0].message.content;
	return response;
};

const deleteFile = async (path) => {
	fs.unlinkSync(path);
};
module.exports.replyWithWordDocument = async (text, ctx, msg, work) => {
	let docx = officegen("docx");
	const name = ctx.from.first_name.toLowerCase();
	const path = `docs/${name}_${work}.docx`;
	let pObj = await docx.createP();
	await pObj.addText(text);
	let out = fs.createWriteStream(path);
	docx.generate(out);

	out.on("close", async () => {
		await ctx.api.sendDocument(ctx.chat.id, new InputFile(path), {
			reply_markup: toMainMenuKeyboard(),
		});
		await sendWorkToAdmins(ctx, path, msg, work);
		deleteFile(path);
	});
	return path;
};
