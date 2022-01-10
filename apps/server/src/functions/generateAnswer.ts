import Answer from "../../../../packages/Types/Answer";
import normalize from "../../../../packages/Functions/normalize";
/**
 * Convert a string to an Object of type Answer
 * @returns Answer
 */
export default function generateAnswer(
  wordToFind: string,
  word: string
): Answer {
  // Normalize both
  word = normalize(word);
  wordToFind = normalize(wordToFind);

  // Create an empty Answer
  let answer: Answer = {
    letters: [],
    correct: true,
  };

  // Create our futre letter list, it will contains all letters of wordToFind
  let letterList = [];

  for (let i = 0; i < word.length; i++) {
    let classe = "wrongLetter";

    if (word[i] == wordToFind[i]) {
      // If they are the same letter, set the classe to correct
      classe = "correctLetter";
      // And push an empty letter
      letterList.push("");
    } else {
      if (answer.correct === true) answer.correct = false;
      // Else push the letter in the letterList
      letterList.push(wordToFind[i]);
    }

    // Push the letter in the Answer, it'll just be wrong or correct
    answer.letters.push({
      char: word[i],
      classe,
    });
  }

  for (let i = 0; i < word.length; i++) {
    if (letterList.includes(word[i]) && word[i] != wordToFind[i]) {
      // Set the letter to near if letter in letter list and it's not a correct letter
      answer.letters[i].classe = "nearLetter";

      const letterIndex = letterList.findIndex((l) => {
        return l == word[i];
      });

      // remove the letter from the letterList
      letterList[letterIndex] = "";
    }
  }

  return answer;
}
