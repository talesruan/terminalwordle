const fs = require("fs");
const readline = require('readline').createInterface({input: process.stdin, output: process.stdout,});

const numberOfLetters = 5;
const maxNumberOfAttempts = 6;
const attempts = [];

const getDictionary = () => {
	const dictionaryFile = fs.readFileSync("dictionary.txt", "utf8");
	const dictionary = dictionaryFile.split("\n").filter(word => word.length === numberOfLetters);
	if (dictionary.length === 0) throw new Error("Dictionary is empty.");
	return dictionary;
}

const pickRandomWord = () => {
	const dictionary = getDictionary();
	return dictionary[getRandomNumberBetween(0, dictionary.length - 1)]
};

const getRandomNumberBetween = (a, b) => {
	return parseInt((Math.random() * (b-a + 1)) + a);
};

const playWord = (word) => {
	word = word.toUpperCase();
	if (word.length !== numberOfLetters) {
		console.log(`Must be a ${numberOfLetters} letters word.`);
		askForWord();
		return;
	}
	attempts.push(word);
	askForWord();
};

const drawBoard = () => {
	console.clear();
	const separator = "+-".repeat(numberOfLetters) + "+";
	for (let row = 0; row < maxNumberOfAttempts; row++) {
		console.log(separator);
		let wordString = "";
		for (let col = 0; col < numberOfLetters; col++) {
			const letter = attempts[row] ? attempts[row][col] : " ";
			wordString += "|" + letter;
		}
		wordString += "|"
		console.log(wordString);
	}
	console.log(separator);
};

const run = () => {
	const chosenWord = pickRandomWord();
	console.log("word is ", chosenWord);
	askForWord();
};

const askForWord = () => {
	drawBoard();
	readline.question(`Enter word: `, word => {
		playWord(word)
		// readline.close();
	});
}

run();