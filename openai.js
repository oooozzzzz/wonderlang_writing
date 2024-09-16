const { default: OpenAI } = require("openai");

const client = new OpenAI({
	apiKey: "sk-SiAS5ZNivSumN9eFmHq4Xpx4JkDRleCA",
	baseURL: "https://api.proxyapi.ru/openai/v1/",
});

module.exports = { client };
