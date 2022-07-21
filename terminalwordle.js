const fs = require("fs");
const readline = require('readline').createInterface({input: process.stdin, output: process.stdout,});

const boardMargin = 4;
const SCORE_GREEN = 3;
const SCORE_YELLOW = 2;
const SCORE_GRAY = 1; // Attempted
const SCORE_NONE = 0; // Not attempted

const winMessages = [
	"Genius",
	"Magnificient",
	"Impressive",
	"Splendid",
	"Great",
	"Phew"
];

const keyboardLayout = [
	"QWERTYUIOP",
	" ASDFGHJKL",
	"  ZXCVBNM"
]

const numberOfLetters = 5;
const maxNumberOfAttempts = 6;
const attempts = [];
const scores = [];
const scoreByLetter = {};
let isGameWon = false;
let isGameLost = false;
let errorMessage;
let chosenWord;
let dictionary;

const getDictionary = () => {
	if (dictionary) return dictionary;
	const dictionaryFile = fs.readFileSync("./dictionaries/english.txt", "utf8");
	dictionary = dictionaryFile.split("\n").filter(word => word.length === numberOfLetters);
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
		errorMessage = `Must be a ${numberOfLetters} letters word.`;
		askForWord();
		return;
	}
	if (!getDictionary().includes(word.toLowerCase())) {
		errorMessage = `${word.toUpperCase()} is not in word list`;
		askForWord();
		return;
	}
	attempts.push(word);
	scoreAttempt(word);

	if (isGameWon){
		drawBoard();
		readline.close();
	} else {
		if (attempts.length >= maxNumberOfAttempts) {
			isGameLost = true;
			drawBoard();
			readline.close();
		} else {
			askForWord();
		}
	}
};

const scoreAttempt = (attemptedWord) => {
	const wordScores = [];
	for (let pos = 0; pos < numberOfLetters; pos++) {
		const letter = attemptedWord[pos];
		const letterScore = getLetterScore(letter, pos);
		scoreByLetter[letter] = scoreByLetter[letter] ? Math.max(scoreByLetter[letter], letterScore) : letterScore;
		wordScores.push(letterScore)
	}
	scores.push(wordScores);
	isGameWon = wordScores.every(score => score === SCORE_GREEN);
};

const drawBoard = () => {
	console.clear();
	// console.log("word is", chosenWord);
	const separator = " ".repeat(boardMargin) + "+---".repeat(numberOfLetters) + "+";
	for (let row = 0; row < maxNumberOfAttempts; row++) {
		console.log(separator);
		let wordString = " ".repeat(boardMargin);
		for (let col = 0; col < numberOfLetters; col++) {
			const letter = attempts[row] ? attempts[row][col] : " ";
			const score = scores[row] ? scores[row][col] : SCORE_NONE;
			wordString += "|" + getColoredString(" " +letter + " ", getColorByScore(score));
		}
		wordString += "|"
		console.log(wordString);
	}
	console.log(separator);
	console.log("");
	for (const keyboardRow of keyboardLayout) {
		let keyboardString = ""
		for (const char of keyboardRow) {
			if (char === " ") keyboardString += "   ";
			else keyboardString += getColoredString(" " +char + " ", getKeyboardColorByScore(scoreByLetter[char]));
		}
		console.log(keyboardString);
	}
	if (isGameWon) {
		console.log("");
		console.log(winMessages[attempts.length - 1].toUpperCase());
	} else if (isGameLost) {
		console.log("");
		console.log(" ".repeat(boardMargin + 8) + chosenWord);
	}
};

const getLetterScore = (letter, position) => {
	if (chosenWord[position] === letter) return SCORE_GREEN;
	if (chosenWord.split("").includes(letter)) return SCORE_YELLOW;
	return SCORE_GRAY;
};

const getColorByScore = (score) => {
	if (score === SCORE_GREEN) return "green";
	if (score === SCORE_YELLOW) return "yellow";
	if (score === SCORE_GRAY) return "gray";
	if (score === SCORE_NONE) return "black";
}

const getKeyboardColorByScore = (score) => {
	if (score === SCORE_GREEN) return "green";
	if (score === SCORE_YELLOW) return "yellow";
	if (score === SCORE_GRAY) return "black";
	return "gray";
}

const getColoredString = (string, color) => {
	const Reset = "\x1b[0m";
	const FgBrightWhite = "\x1b[97m";
	const BgBlue = "\x1b[44m";
	const BgGreen = "\x1b[42m";
	const BgYellow = "\x1b[43m"
	const BgWhite = "\x1b[47m"
	const BgGray = "\x1b[100m"
	if (color === "green") return FgBrightWhite + BgGreen + string + Reset;
	if (color === "yellow") return FgBrightWhite + BgYellow + string + Reset;
	if (color === "gray") return FgBrightWhite + BgGray + string + Reset;
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