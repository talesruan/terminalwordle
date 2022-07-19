const fs = require("fs");
const readline = require('readline').createInterface({input: process.stdin, output: process.stdout,});

const numberOfLetters = 5;
const maxNumberOfAttempts = 6;
const attempts = [];
let errorMessage;
let chosenWord;

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
		// console.log(`Must be a ${numberOfLetters} letters word.`);
		errorMessage = `Must be a ${numberOfLetters} letters word.`;
		askForWord();
		return;
	}
	attempts.push(word);
	askForWord();
};

const drawBoard = () => {
	console.clear();
	// console.log("word is", chosenWord);
	const separator = "+---".repeat(numberOfLetters) + "+";
	for (let row = 0; row < maxNumberOfAttempts; row++) {
		console.log(separator);
		let wordString = "";
		for (let col = 0; col < numberOfLetters; col++) {
			const letter = attempts[row] ? attempts[row][col] : " ";
			wordString += "|" + getColoredString(" " +letter + " ", getLetterColor(letter, col));
		}
		wordString += "|"
		console.log(wordString);
	}
	console.log(separator);
};

const getLetterColor = (letter, position) => {
	if (chosenWord[position] === letter) return "green";
	if (chosenWord.split("").includes(letter)) return "yellow";
	return "gray";
};

const getColoredString = (string, color) => {
	const Reset = "\x1b[0m";
	const BgBlue = "\x1b[44m";
	const BgGreen = "\x1b[42m";
	const BgYellow = "\x1b[43m"
	if (color === "green") return BgGreen + string + Reset;
	if (color === "yellow") return BgYellow + string + Reset;
	return string;
};

const run = () => {
	chosenWord = pickRandomWord().toUpperCase();
	askForWord();
};

const askForWord = () => {
	drawBoard();
	if (errorMessage) console.log(errorMessage);
	errorMessage = null;
	readline.question(`Enter word: `, word => {
		playWord(word)
		// readline.close();
	});
}

run();