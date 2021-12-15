interface Letter {
    char: string;
    classe: string;
}

export default interface Answer {
    letters: Letter[];
    correct: boolean
}