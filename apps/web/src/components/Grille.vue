<script setup lang="ts">
import Row from "./Row.vue";
import { ref, toRefs } from "@vue/reactivity";
import { isInDictionary } from "../functions/dictionary";
import normalize from "../../../../packages/functions/normalize";
import Answer from "../../../../packages/Types/Answer"
import useSocket from "../stores/socket";
import usePlayer from "../stores/player";

interface Props {
    gridId: string;
}

const props = defineProps<Props>();

const { gridId } = toRefs(props);

const { getGridData, submitAnswer } = useSocket()

const { player } = usePlayer()

const answers = ref<Answer[]>([]);
const closestWord = ref<Answer>();
const finished = ref<boolean>(false)
const wordLength = ref<number>(0)
const maxRows = 6
const playerTurn = ref<number>(0)
const time = ref<number>(0)

let answer = ref("");

getGridData(gridId.value, (grid) => {
    wordLength.value = grid.wordLength
    finished.value = grid.finished
    answers.value = grid.answers
    playerTurn.value = grid.currentTurn
    closestWord.value = grid.closestWord
    time.value = (10 - grid.time) + 1

    if (answers.value.length >= maxRows) {
        answers.value = answers.value.splice(Math.floor(answers.value.length / maxRows) * maxRows, answers.value.length - Math.floor(answers.value.length / maxRows) * maxRows);
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

    if (!player) return

    submitAnswer(gridId.value, answer.value, player, function () {
        answer.value = "";
    })
}
</script>

<template>
    <transition name="fade" class="flex">
        <div class="flex flex-col">
            <div v-for="row in maxRows" :key="row" class="flex">
                <Row
                    v-if="row - 1 == answers.length && (!answers.at(-1) || answers.at(-1)?.correct === false)"
                    :word="closestWord"
                />
                <Row v-else-if="answers[row - 1]" :word="answers[row - 1]" />
                <Row v-else :word-length="wordLength" />
            </div>
            <div class="flex flex-col items-center">
                <form @submit.prevent="submit">
                    <input
                        placeholder="Tapez votre réponse ici"
                        class="mt-2 px-4 py-1"
                        v-model="answer"
                        :maxlength="wordLength"
                    />
                </form>
                <div>Joueur {{ playerTurn }}</div>
                <div>Temps {{ time }}</div>
                <div class="flex space-x-1">
                    <div
                        v-for="i in time"
                        class="bg-fuchsia-600 h-6 w-6 rounded-full flex items-center justify-center text-white"
                    >{{ i }}</div>
                </div>
            </div>
        </div>
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
