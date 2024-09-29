const { makeAdmin, getAdminPassword } = require("../db");
const { adminMenu } = require("../menus/adminMenu");

module.exports = async (ctx) => {
	await makeAdmin(ctx.from.id);
	await ctx.msg.delete();
	await ctx.reply("Добро пожаловать в панель администратора", {
		reply_markup: adminMenu,
	});
};
