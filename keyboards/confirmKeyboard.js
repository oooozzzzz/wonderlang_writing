const { InlineKeyboard } = require("grammy");

const confirmKeyboard = new InlineKeyboard()
	.text("Подтвердить", "ok")
	.row()
	.text("Отмена", "cancel");

module.exports = { confirmKeyboard };
