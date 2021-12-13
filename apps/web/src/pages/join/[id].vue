<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { useRouter } from 'vue-router';
import useSocket from '../../stores/socket';

const router = useRouter()

const { id } = useAttrs()

const { doesGameExist, joinGame } = useSocket()

let showPage = ref<boolean>(false)

let username = ref<string>("")

async function init() {
    showPage.value = (await doesGameExist(Number(id)))

    if (showPage.value == false) router.push("/404")
}

async function join() {
    const join = await joinGame(username.value, Number(id))

    if (join) {
        router.push('/game/' + id)
    }
}

init()
</script>

<template>
    <div v-if="showPage">
        <input v-model="username" class="border border-fuchsia-900" placeholder="Pseudonyme" />
        <button class="border border-fuchsia-900" @click="join">Rejoindre</button>
    </div>
</template>