<script setup lang="ts">
import Grille from "../../components/Grille.vue";
import { ref, useAttrs } from "vue";
import { useRouter } from "vue-router";
import useSocket from "../../stores/socket";
import Player from "../../../../../packages/Classes/Player";

const router = useRouter();

const { id } = useAttrs();

const gameId = "game:" + id;

const { doesGameExist, onUserUpdate, updateUsers, startGame, onGrid } =
  useSocket();

let showPage = ref<boolean>(false);
let users = ref<Player[]>([]);
let gridId = ref<string>("");

function start() {
  startGame(gameId);
}

async function init() {
  showPage.value = await doesGameExist(gameId);

  if (showPage.value == false) router.push("/404");

  updateUsers(gameId);

  onUserUpdate((newUsers) => {
    users.value = newUsers;
  });

  onGrid((id) => {
    gridId.value = id;
  });
}

init();
</script>

<template>
  <div v-if="showPage" class="bg-gradient-to-r from-red-700 to-red-800 h-screen flex justify-center items-center">
    
    <div v-if="gridId != ''" >
      <Grille :grid-id="gridId" :players="users" />
    </div>

    <div class="flex flex-col space-y-2 text-white" v-else >
      
      <div>
        <p class="text-xl">Liste des joueurs :</p>
        <div v-for="user in users" class="pl-2">- {{ user.username }}</div>
      </div>
      <button
        @click="start"
        class="text-lg px-10 py-1 bg-red-500 rounded text-white"
      >
        Start
      </button>
    </div>
  

  </div>
</template>
