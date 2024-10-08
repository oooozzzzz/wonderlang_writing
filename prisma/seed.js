const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
	const adminPass = await prisma.password.create({
		data: { label: "admin", value: "admin" },
	});
	const ownerPass = await prisma.password.create({
		data: { label: "owner", value: "owner" },
	});

	const correction = await prisma.prompt.create({
		data: { label: "correction", value: `You are an English tutor proofreading ESL students’ essays. You must take the text below and return it without any introductory sentence from you. In the text, you must 
1. identify all gross grammar and vocabulary mistakes (look at tenses, subject-verb agreement, articles, prepositions, verb patterns, syntax, punctuation, spelling, word choice, collocations).
2. highlight all words and sentence parts with spelling mistakes in CAPITAL LETTERS, but do not correct them. Do not highlight the words that are correctly used and spelled.
3. put a number in brackets after each mistake.
4. provide the list of gross mistakes under the text, explaining what is incorrect in each case. 
5. Provide an upgraded version of the original piece of writing with more advanced words and collocations. Highlight in bold each word or part of the sentence that you either change or add to the original text.` },
	});

	const vocab_booster = await prisma.prompt.create({
		data: { label: "vocab_booster", value: "You are an IELTS tutor helping a student to prepare for IELTS writing part 2. The student's essay is given below. Please, improve the essay by including B2-level words, idioms, or collocations relevant to the topic. Write in capitals all the vocabulary items that you’ve added or changed. Then provide a list of the words you’ve added with their definitions."}
	})

	const IELTS_essay_upgrade = await prisma.prompt.create({
		data: { label: "IELTS_essay_upgrade", value: "You are an IELTS tutor. Please, help a student rewrite the essay below so that it is more coherent and better aligns both with the topic and with IELTS essay criteria. The thesis statement should include the main ideas from body paragraphs, so avoid formulas like “this essay will discuss…”. Please, highlight all advanced expressions that you introduced into your version of the essay in bold and provide a list with definitions under the text. The topic is the first line in the message. The topic is not to be corrected"}
	})

	console.log(correction, vocab_booster, IELTS_essay_upgrade);
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
