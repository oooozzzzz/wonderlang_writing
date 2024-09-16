const { Bot, session } = require("grammy");
const { adminMenu } = require("./menus/adminMenu");
const {
	conversations,
	createConversation,
} = require("@grammyjs/conversations");
const { hydrate } = require("@grammyjs/hydrate");
const { I18n } = require("@grammyjs/i18n");
const { startMenu } = require("./menus/startMenu");
const { ownerMenu } = require("./menus/ownerMenu");
const { changeAdminPassword } = require("./conversations/changeAdminPassword");
const { changeOwnerPassword } = require("./conversations/changeOwnerPassword");
const { notifyUsers } = require("./conversations/notifyUsers");
const { createPoll } = require("./conversations/createPoll");
const {
	gptConversation,
	gptCorrection,
	vocabBooster,
	changeCorrectionPrompt,
	changeVocabBoosterPrompt,
	essayUpgrade,
	changeEssayUpgraderPrompt,
} = require("./conversations/gptConversation");
const { default: OpenAI } = require("openai");
require("dotenv").config();

const token = process.env.TOKEN;

const bot = new Bot(token);

const i18n = new I18n({
	defaultLocale: "ru",
	useSession: true, // whether to store user language in session
	directory: "locales", // Load all translation files from locales/.
});

bot.use(hydrate());
bot.use(
	session({
		initial() {
			return {};
		},
	})
);

bot.use(i18n);

bot.api.setMyCommands([
	{ command: "start", description: "Начать работу с ботом" },
]);

bot.use(conversations());

bot.use(createConversation(changeAdminPassword));
bot.use(createConversation(changeOwnerPassword));
bot.use(createConversation(createPoll));
bot.use(createConversation(notifyUsers));
bot.use(createConversation(gptCorrection));
bot.use(createConversation(vocabBooster));
bot.use(createConversation(essayUpgrade));
bot.use(createConversation(changeCorrectionPrompt));
bot.use(createConversation(changeVocabBoosterPrompt));
bot.use(createConversation(changeEssayUpgraderPrompt));
bot.use(startMenu);
bot.use(adminMenu);
bot.use(ownerMenu);
module.exports = { bot };
