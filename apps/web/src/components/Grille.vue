<script setup lang="ts">
import { ref, toRefs } from "@vue/reactivity";
import { addAtIndex, getLetterClass } from "../functions/word";
import { isInDictionary } from "../functions/dictionary";
import normalize from "../../../../packages/functions/normalize";
import useSocket from "../stores/socket";
import usePlayer from "../stores/player";

interface Props {
    gridId: string;
}

const props = defineProps<Props>();

const { gridId } = toRefs(props);

const { getGridData, submitAnswer } = useSocket()

const { player } = usePlayer()

const answers = ref<string[]>([]);
const wordToFind = ref<string>("");
const closestWord = ref<string>("");
const finished = ref<boolean>(false)
const maxRows = 6
const playerTurn = ref<number>(0)
const time = ref<number>(0)

let answer = ref("");

getGridData(gridId.value, (grid) => {
    console.log(grid);
    
    finished.value = grid.finished
    answers.value = grid.answers
    closestWord.value = grid.closestWord
    wordToFind.value = grid.wordToFind
    playerTurn.value = grid.currentTurn
    time.value = (10 - grid.time) + 1

    if (answers.value.length >= maxRows) {
        answers.value = answers.value.splice(maxRows - 1, maxRows);
    }
})

function submit() {
    if (finished.value) {
        return;
    }
    if (!isInDictionary(normalize(answer.value))) {
        // TODO: toast pas dans le dico
        return;
    }

    if (wordToFind.value.length != answer.value.length) {
        // TODO: Toast pas assez de lettres
        return;
    }

    if (!player) return

    submitAnswer(gridId.value, answer.value, player, function () {
        answer.value = "";
    })
}
</script>

<template>
    <transition name="fade" class="flex">
        <div v-if="wordToFind != ''" class="flex flex-col">
            <div v-for="row in maxRows" :key="row" class="flex">
                <div
                    v-if="row - 1 == answers.length && answers.at(-1) != wordToFind"
                    v-for="i in closestWord.length"
                    class="wrongLetter"
                >{{ closestWord[i - 1] }}</div>
                <div
                    v-else
                    :class="getLetterClass(answers[row - 1], i - 1, wordToFind)"
                    v-for="i in wordToFind.length"
                >
                    <div class="circle">
                        <span v-if="answers[row - 1]">{{ answers[row - 1][i - 1] }}</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center">
                <form @submit.prevent="submit">
                    <input
                        placeholder="Tapez votre réponse ici"
                        class="mt-2 px-4 py-1"
                        v-model="answer"
                        :maxlength="wordToFind.length"
                    />
                </form>
                <div>Joueur {{playerTurn}}</div>
                <div>Temps {{time }}</div>
                <div class="flex space-x-1"><div v-for="i in time" class="bg-fuchsia-600 h-6 w-6 rounded-full flex items-center justify-center text-white">{{ i }}</div></div>
            </div>
            

        </div>
        <div class="absolute" v-else>Chargement de la grille</div>
    </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
