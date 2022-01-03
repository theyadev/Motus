<script setup lang="ts">
import { useRouter } from "vue-router";
import usePlayer from "./stores/player";
import useSocket from "./stores/socket";

const routesToDisconnect = ["/game"];

const { currentRoute, beforeEach } = useRouter();
const { player } = usePlayer()
const { leaveGame } = useSocket()

const predicate = (route: string) => {
  return currentRoute.value.fullPath.startsWith(route);
};

beforeEach(() => {
  if (routesToDisconnect.some(predicate) && player.value) {
    const gameId = currentRoute.value.params.id as string

    if (!gameId) return

    leaveGame(player.value, gameId)
  }
});
</script>

<template>
  <router-view />
</template>
