<script setup lang="ts">
import { ref } from "vue";
import useSocket from "../stores/socket"
import { useRouter } from "vue-router";
import Grille from "../components/Grille.vue";

const router = useRouter()

let username = ref<string>("")
const { createGame } = useSocket()

async function create(){
  const id = await createGame(username.value)

  router.push("/game/" + id.split("game:")[1])
}

</script>

<template>
  <!-- <div class="flex justify-around h-screen bg-red-600">
    <Grille :roomId="1235612" gridId="Dark" />
  </div> -->
  <div class="flex flex-col w-1/2 space-y-2 px-16">
    <input v-model="username" class="border border-fuchsia-900"  placeholder="Pseudonyme" />
    <button class="border border-fuchsia-900" @click="create">Créer</button>
  </div>
  
</template>
