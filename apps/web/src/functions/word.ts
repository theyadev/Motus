function getNumberOfMisplacedLetters(letter: string, word: string, wordToFind: string) {
    let nb = 0

    for (let i = 0; i < word.length; i++) {
        if (wordToFind[i] == letter && word[i] != wordToFind[i]) nb++
    }

    return nb
}

function getNumberOfPreviousMisplacedLetters(letter: string, index: number, word: string, wordToFind: string) {
    let nb = 0

    for (let i = 0; i < index; i++) {
        if (word[i] == letter && word[i] != wordToFind[i]) nb++
    }

    return nb
}

export function addAtIndex(string: string, index:number, letter: string) {
    return string.slice(0,index) + letter + string.slice(index+1,string.length)
}

export function getLetterClass(word: string | undefined, index: number, wordToFind: string) {
    if (word === undefined) return 'wrongLetter'

    if (word[index] == wordToFind[index])  return 'correctLetter'

    if (getNumberOfMisplacedLetters(word[index], word, wordToFind) - getNumberOfPreviousMisplacedLetters(word[index], index, word, wordToFind) > 0) return 'nearLetter'

    return 'wrongLetter'
}