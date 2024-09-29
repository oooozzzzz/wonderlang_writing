const { makeAdmin, getOwnerPassword } = require("../db");
const { ownerMenu } = require("../menus/ownerMenu");

module.exports = async (ctx) => {
	if (ctx.msg.text == await getOwnerPassword()) {
		await ctx.msg.delete()
		await makeAdmin(ctx.from.id)
		await ctx.reply("Добро пожаловать в панель владельца", {
			reply_markup: ownerMenu,
		});
	}
};