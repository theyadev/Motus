<script setup lang="ts">
import Row from "./Row.vue";
import { ref, toRefs } from "@vue/reactivity";
import Answer from "../../../../packages/Types/Answer";
import useSocket from "../stores/socket";
import usePlayer from "../stores/player";
import Player from "../../../../packages/Classes/Player";

interface Props {
  gridId: string;
  players: Player[];
}

const props = defineProps<Props>();

const { gridId, players } = toRefs(props);

const { getGridData, submitAnswer } = useSocket();

const { player } = usePlayer();

const answers = ref<Answer[]>([]);
const closestWord = ref<Answer>();
const finished = ref<boolean>(false);
const wordLength = ref<number>(0);
const maxRows = 6;
const playerTurn = ref<number>(0);
const time = ref<number>(0);
const currentPlayerTurn = ref<Player>();

let answer = ref("");

getGridData(gridId.value, (grid) => {
  wordLength.value = grid.wordLength;
  finished.value = grid.finished;
  answers.value = grid.answers;
  playerTurn.value = grid.currentTurn;
  closestWord.value = grid.closestWord;
  currentPlayerTurn.value = players.value[grid.currentTurn];

  time.value = 10 - grid.time + 1;

  if (answers.value.length >= maxRows) {
    /* [0,1,2,3,4,5,6,7,8,9,10]
       On enleve de la liste autant de multiples de (maxRows - 1) que possible en partant du début si le résultat n'est pas une liste vide*/
    let multiplesOfMaxRowsInAnswers = Math.floor(answers.value.length / (maxRows - 1)) - Number(!(answers.value.length % (maxRows - 1)))

    answers.value.splice(0, multiplesOfMaxRowsInAnswers * (maxRows - 1))
  }
});

function submit() {
  if (finished.value) {
    return;
  }

  if (!player.value) return;

  submitAnswer(gridId.value, answer.value, player.value, function () {
    answer.value = "";
  });
}

function convertTime(time: number) {
  const sec = (time % 60).toString().padStart(2, "0");
  const min = Math.floor(time / 60);

  return min + ":" + sec;
}
</script>

<template>
  <transition name="fade" class="flex">
    <div class="flex flex-col">
      <div class="flex flex-col ring-2 ring-white">
        <div v-for="row in maxRows" :key="row" class="flex">
          <Row
            v-if="
              row - 1 == answers.length &&
              (!answers.at(-1) || answers.at(-1)?.correct === false)
            "
            :word="closestWord"
          />
          <Row v-else-if="answers[row - 1]" :word="answers[row - 1]" />
          <Row v-else :word-length="wordLength" />
        </div>
      </div>
      <div class="flex flex-col items-center">
        <form
          @submit.prevent="submit"
          v-if="currentPlayerTurn?.username == player?.username"
          class="py-2"
        >
          <input
            placeholder="Tapez votre réponse ici"
            class="mt-2 px-4 py-1"
            v-model="answer"
            :maxlength="wordLength"
          />
        </form>
        <div v-else class="text-white py-2">C'est au tour de {{ currentPlayerTurn?.username }}</div>

        <div class="bg-blue-600 px-4 py-1 text-xl text-white">{{ convertTime(time) }}</div>
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
