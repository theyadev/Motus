<script setup lang="ts">
import { ref } from '@vue/reactivity';

const wordToFind = ref("effrayee")

let answers = ref<string[]>([])
let answer = ref("")

function getNumberOfMisplacedLetters(letter: string, word: string) {
    let nb = 0

    for (let i = 0; i < word.length; i++) {
        if (wordToFind.value[i] == letter && word[i] != wordToFind.value[i]) nb++
    }

    return nb
}

function getNumberOfPreviousMisplacedLetters(letter: string, index: number, word: string) {
    let nb = 0

    for (let i = 0; i < index; i++) {
        if (word[i] == letter && word[i] != wordToFind.value[i]) nb++
    }

    return nb
}

function getLetterClass(word: string, index: number) {
    if (word[index] == wordToFind.value[index]) return 'correctLetter'

    if (getNumberOfMisplacedLetters(word[index], word) - getNumberOfPreviousMisplacedLetters(word[index], index, word) > 0) return 'nearLetter'

    return 'wrongLetter'
}

function isInDictionary(word: string) {
    return true
}

function submitAnswer() {
    if (wordToFind.value.length == answer.value.length) {
        answers.value.push(answer.value);
    }
    else if (!isInDictionary(answer.value)) {
        //TODO: toast pas dans le dico
    }
    else {
        //TODO: toast pas assez de lettres
    }
    answer.value = ""
}

</script>

<template>
    <div class="flex flex-col bg-red-600 h-screen py-2 px-2">
        <div class="flex flex-col items-center">
            <div v-for="row in 5" :key="row" class="flex">
                <div
                    :class="answers[row - 1] ? getLetterClass(answers[row - 1], i - 1) : 'wrongLetter'"
                    v-for="i in wordToFind.length"
                    :key="i"
                >
                    <div class="circle">
                        <span v-if="answers[row - 1]">{{ answers[row - 1][i - 1] }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center">
            <form @submit.prevent="submitAnswer">
                <input
                    placeholder="Tapez votre réponse ici"
                    class="mt-2 px-4 py-1"
                    v-model="answer"
                    :maxlength="wordToFind.length"
                />
            </form>
        </div>
    </div>
</template>
