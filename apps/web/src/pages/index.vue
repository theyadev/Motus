<script setup lang="ts">
import useSocket from "../stores/socket";

import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { createGame, joinGame } = useSocket();

let username = ref<string>("");

async function create() {
  const reg = /[a-zA-Z]/g;

  const usernameLength = username.value.match(reg)?.length;

  if (!usernameLength) return;

  if (usernameLength < 3) {
    //toast

    return;
  } else if (username.value.length > 14) {
    //toast

    return;
  }

  const id = await createGame();

  const join = await joinGame(username.value, id);

  if (!join) return;

  router.push("/game/" + id.split("game:")[1]);
}
</script>

<template>
  <div
    class="flex h-screen justify-center items-center bg-gradient-to-r from-blue-400 to-blue-700"
  >
    <div class="flex flex-col w-1/2 space-y-2 py-16 px-16 items-center">
      <div class="text-8xl text-white">Motus !</div>
      <input
        v-model="username"
        class="border border-gray-900 py-2 px-4"
        placeholder="Pseudonyme"
      />
      <button
        class="border border-gray-900 py-2 px-4 bg-gray-200"
        @click="create"
      >
        Créer
      </button>
    </div>
  </div>
</template>
