<script setup lang="ts">
import Grille from "../../components/Grille.vue";
import { ref, useAttrs } from "vue";
import { useRouter } from "vue-router";
import useSocket from "../../stores/socket";
import usePlayer from "../../stores/player";
import Player from "../../../../../packages/Classes/Player";
import Leaderboard from "../../components/Leaderboard.vue";
import Difficulty from "../../../../../packages/Types/Difficulty";
import { getCipherInfo } from "crypto";

const router = useRouter();

const { id } = useAttrs();

const gameId = "game:" + id;

const {
  onDifficulty,
  getInfo,
  onRound,
  doesGameExist,
  onUserUpdate,
  updateUsers,
  startGame,
  onGrid,
  onStatus,
  getStatus,
  updateRound,
  updateDifficulty,
} = useSocket();

const { player } = usePlayer();

let showPage = ref<boolean>(false);
let users = ref<Player[]>([]);
let gridId = ref<string>("");
let gameStatus = ref<string>("");
let roundMax = ref<number>(5);
let difficulty = ref<Difficulty>("Medium");

const roundsList = [5, 6, 7, 8, 9, 10];
const difficulties = ["Easy", "Medium", "Hard", "Impossible"];

function start() {
  startGame(gameId);
}

function copyLink() {
  const url = "http://localhost:3000/join/" + id;
  navigator.clipboard.writeText(url);
}

async function init() {
  showPage.value = await doesGameExist(gameId);

  if (showPage.value == false) router.push("/404");

  updateUsers(gameId);
  getStatus(gameId);
  getInfo(gameId);

  onUserUpdate((newUsers) => {
    users.value = newUsers;
  });

  onGrid((id) => {
    gridId.value = id;
  });

  onStatus((status) => {
    gameStatus.value = status;
  });

  onDifficulty((diff) => {
    difficulty.value = diff;
  });

  onRound((round) => {
    roundMax.value = round;
  });
}

function handleChangeRound(event: Event) {
  const target = <HTMLSelectElement>event.target;
  updateRound(target.value, gameId);
}

function handleChangeDifficulty(event: Event) {
  const target = <HTMLSelectElement>event.target;
  updateDifficulty(target.value, gameId);
}

init();
</script>

<template>
  <div
    v-if="showPage"
    class="bg-gradient-to-r from-red-700 to-red-800 h-screen w-screen flex justify-center items-center"
  >
    <div v-if="gameStatus == 'PLAYING'">
      <div class="flex justify-between w-screen">
        <div class="flex flex-col mx-5 space-y-2 items-center">
          <h1 class="text-white font-bold">Joueurs </h1>
          <div v-for="player in users" class="bg-red-300 py-2 px-4 text-center shadow">
          {{player.username}}
          </div>
        </div>
        <Grille :grid-id="gridId" :players="users" />
        <div></div>
      </div>
    </div>

    <Leaderboard v-if="gameStatus == 'LEADERBOARD'" :players="users" />

    <div class="flex flex-col space-y-2 text-white" v-if="gameStatus == 'MENU'">
      <div>
        <p class="text-xl">Liste des joueurs :</p>
        <div v-for="user in users" class="pl-2">- {{ user.username }}</div>
      </div>

      <button
        @click="start"
        class="text-lg px-10 py-1 bg-red-500 rounded text-white disabled:opacity-25 disabled:cursor-not-allowed"
        :disabled="!player?.host"
      >
        Start
      </button>

      <button
        @click="copyLink"
        class="text-lg px-10 py-1 bg-yellow-500 rounded text-white disabled:opacity-25"
      >
        Copier le lien
      </button>

      <select
        v-model="roundMax"
        class="text-black disabled:opacity-75 disabled:cursor-not-allowed"
        @change="handleChangeRound"
        :disabled="!player?.host"
      >
        <option v-for="round in roundsList" :value="round" class="text-black">
          {{ round }}
        </option>
      </select>

      <select
        v-model="difficulty"
        class="text-black disabled:opacity-75 disabled:cursor-not-allowed"
        @change="handleChangeDifficulty"
        :disabled="!player?.host"
      >
        <option v-for="diff in difficulties" :value="diff" class="text-black">
          {{ diff }}
        </option>
      </select>
    </div>
  </div>
</template>
