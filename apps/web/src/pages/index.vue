<script setup lang="ts">
import { ref } from "vue";
import useSocket from "../stores/socket"
import { useRouter } from "vue-router";

const router = useRouter()

let username = ref<string>("")
const { createGame } = useSocket()

async function create() {
  const id = await createGame(username.value)

  router.push("/game/" + id.split("game:")[1])
}

</script>

<template>
  <div class="flex h-screen justify-center items-center">
    <div class="flex flex-col w-1/2 space-y-2 py-16 px-16 border border-fuchsia-500 items-center">
      <div class="text-3xl">Motus !</div>
      <input v-model="username" class="border border-fuchsia-900" placeholder="Pseudonyme" />
      <button class="border border-fuchsia-900" @click="create">Créer</button>
    </div>
  </div>
</template>
