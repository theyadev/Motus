<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { useRouter } from 'vue-router';
import useSocket from '../../stores/socket';

const router = useRouter()

const { id } = useAttrs()

const gameId = "game:" + id

const { doesGameExist, joinGame } = useSocket()

let showPage = ref<boolean>(false)

let username = ref<string>("")

async function init() {
    showPage.value = (await doesGameExist(gameId))

    if (showPage.value == false) router.push("/404")
}

async function join() {
    const join = await joinGame(username.value, gameId)

    if (join) {
        router.push('/game/' + id)
    }
}

init()
</script>

<template>
    <div v-if="showPage" class="space-y-2 h-screen bg-gradient-to-r from-red-700 to-red-800 flex flex-col justify-center items-center">
        <input v-model="username" class="border border-fuchsia-900 px-4 py-2" placeholder="Pseudonyme" />
        <button class="bg-red-400 px-4 py-2" @click="join">Rejoindre</button>
    </div>
</template>