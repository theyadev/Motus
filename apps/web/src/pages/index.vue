<script setup lang="ts">
import { ref } from "vue";
import useSocket from "../stores/socket";
import { useRouter } from "vue-router";

const router = useRouter();

let username = ref<string>("");
const { createGame } = useSocket();

async function create() {
  const id = await createGame(username.value);

  router.push("/game/" + id.split("game:")[1]);
}
</script>

<template>
  <div class="flex h-screen justify-center items-center bg-gradient-to-r from-blue-400 to-blue-700">
    <div
      class="
        flex flex-col
        w-1/2
        space-y-2
        py-16
        px-16
        
        items-center
      "
    >
      <div class="text-8xl text-white ">Motus !</div>
      <input
        v-model="username"
        class="border border-gray-900 py-2 px-4"
        placeholder="Pseudonyme"
      />
      <button class="border border-gray-900 py-2 px-4 bg-gray-200" @click="create">Créer</button>
    </div>
  </div>
</template>
