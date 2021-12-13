<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { useRouter } from 'vue-router';
import useSocket from '../../stores/socket';
import Player from "../../../../types/Player"

const router = useRouter()

const { id } = useAttrs()

const { doesGameExist, onUserUpdate, updateUsers } = useSocket()

let showPage = ref<boolean>(false)
let users = ref<Player[]>([])
async function init() {
    const gameId = Number(id)

    showPage.value = (await doesGameExist(gameId))

    if (showPage.value == false) router.push("/404")

    updateUsers(gameId)

    onUserUpdate((newUsers) => {
        users.value = newUsers
    })
}

init()
</script>

<template>
    <div v-if="showPage">
        GAME
        <div v-for="user in users">{{ user.username}}</div>
    </div>
</template>