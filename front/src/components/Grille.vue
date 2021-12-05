<script setup lang="ts">
import { ref, toRefs } from '@vue/reactivity';
import { defineProps } from 'vue';
import { addAtIndex, getLetterClass } from '../functions/word';
import { isInDictionary } from '../functions/dictionary';
import normalize from '../../../functions/normalize';
import useSocket from '../stores/socket';

const props = defineProps({
    id: Number,
    player: String
})

const { id, player } = toRefs(props)

const { socket } = useSocket()

socket.emit("START GAME")

const answers = ref<string[]>([])
const wordToFind = ref<string>("")
const closestWord = ref<string>("")

socket.on("START", (word) => {
    wordToFind.value = word
    closestWord.value = ".".repeat(word.length)
})

let answer = ref("")

function submitAnswer() {
    if (!isInDictionary(normalize(answer.value))) {
        //TODO: toast pas dans le dico
        return
    }

    if (wordToFind.value.length != answer.value.length) {
        // TODO: Toast pas assez de lettres
        return
    }

    answers.value.push(normalize(answer.value));    

    if (answer.value == wordToFind.value) {

    } else {
        for (let i = 0; i < answer.value.length; i++) {
            if (answer.value[i] == wordToFind.value[i]) {
                closestWord.value = addAtIndex(closestWord.value, i, answer.value[i])
            }
        }

        if (answers.value.length == 6) {
            answers.value = answers.value.splice(5,6)
        }
    }

    answer.value = ""
}
</script>

<template>
    <div class="flex flex-col bg-red-600 h-screen py-2 px-2">
        <div class="flex flex-col items-center">
            <div v-for="row in 6" :key="row" class="flex">
                <div
                    v-if="row - 1 == answers.length"
                    class="wrongLetter"
                    v-for="i in wordToFind.length"
                    :key="i + 2">
                        {{ closestWord[i-1] }}
                </div>
                <div
                    v-else
                    :class="answers[row - 1] ? getLetterClass(answers[row - 1], i - 1, wordToFind) : 'wrongLetter'"
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
