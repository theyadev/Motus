import { readFileSync } from "fs"
import normalize from '../../../functions/normalize';
import path from 'path';

function readWords() : string[] {
    const res = readFileSync(getWordsPath(), {
        encoding: "utf-8"
    })

    return JSON.parse(res)
}

function getWordsPath() {
    return path.resolve(__dirname, '../../../../words.json');
}

export default function getWords() {
    const words = readWords()

    return words.map(word => {
        return normalize(word)
    })
}