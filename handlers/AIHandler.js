const { getGPTanswer } = require("../services");

module.exports = async (ctx) => {
	const text = ctx.msg.text;

	console.log(ctx.from.first_name + " " + text);
	// const message = {
	// 	role: "user",
	// 	content: [{ type: "text", text }],
	// };
	// conversation.push(message);
	ctx.api.sendChatAction(ctx.from.id, "typing");
	// const chatCompletion = await client.chat.completions.create({
	// 	messages: conversation,
	// 	model: "gpt-4o-mini",
	// });
	// const response = chatCompletion.choices[0].message;
	// conversation.push(response);
	// await ctx.reply(response.content);
	
	const {response} = await getGPTanswer(text, "correction")
	console.log("АССИСТЕНТ " + response);
	ctx.reply(response)
};
