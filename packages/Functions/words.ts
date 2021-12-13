import normalize from './normalize';
import words from "../words.json"

function readWords() : string[] {
    return words as string[]
}

export default function getWords() {
    const words = readWords()

    return words.map(word => {
        return normalize(word)
    })
}