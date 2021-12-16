<script setup lang="ts">
import { toRefs } from "vue";
import Answer from "../../../../packages/Types/Answer";

interface Props {
  word?: Answer;
  wordLength?: number;
}
const props = defineProps<Props>();
const { word, wordLength } = toRefs(props);
</script>

<template>
  <div
    v-if="word"
    v-for="i in word.letters.length"
    :class="word.letters[i - 1].classe"
  >
    <div class="circle">{{ word.letters[i - 1].char }}</div>
  </div>
  <div v-else v-for="i in wordLength" class="wrongLetter"></div>
</template>
