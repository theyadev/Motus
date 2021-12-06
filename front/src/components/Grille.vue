<script setup lang="ts">
import { ref, toRefs } from "@vue/reactivity";
import { addAtIndex, getLetterClass } from "../functions/word";
import { isInDictionary } from "../functions/dictionary";
import normalize from "../../../functions/normalize";
import useSocket from "../stores/socket";

interface Props {
  id: number;
  player: string;
}

const props = defineProps<Props>();

const { id, player } = toRefs(props);

const { startGame, onStart } = useSocket();

const answers = ref<string[]>([]);
const wordToFind = ref<string>("");
const closestWord = ref<string>("");

const maxRows = 6

let answer = ref("");

startGame();

onStart((word) => {
  wordToFind.value = word;
  closestWord.value = ".".repeat(word.length);
});

function submitAnswer() {
  if (!isInDictionary(normalize(answer.value))) {
    // TODO: toast pas dans le dico
    return;
  }

  if (wordToFind.value.length != answer.value.length) {
    // TODO: Toast pas assez de lettres
    return;
  }

  answers.value.push(normalize(answer.value));

  if (answer.value != wordToFind.value) {
    for (let i = 0; i < answer.value.length; i++) {
      if (answer.value[i] == wordToFind.value[i]) {
        closestWord.value = addAtIndex(closestWord.value, i, answer.value[i]);
      }
    }

    if (answers.value.length == maxRows) {
      answers.value = answers.value.splice(maxRows - 1, maxRows);
    }
  }

  answer.value = "";
}
</script>

<template>
  <transition name="fade" class="flex">
    <div v-if="wordToFind != ''" class="flex flex-col">
      <div v-for="row in maxRows" :key="row" class="flex">
        <div
          v-if="row - 1 == answers.length"
          v-for="i in closestWord.length"
          class="wrongLetter"
        >
          {{ closestWord[i - 1] }}
        </div>
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
