<script setup lang="ts">
import { ref, toRefs } from "@vue/reactivity";
import Player from "../../../../packages/Classes/Player";

interface Props {
    players: Player[];
}

const props = defineProps<Props>();

const { players } = toRefs(props);


</script>

<template>
    <div class="flex flex-col">
        <h1 class="text-5xl text-white py-2">Classement final</h1>
        <div class="w-52 space-y-4">
            <div v-for="player, i in players">
                <div v-if="i==0" class="bg-yellow-500 rounded-full px-4 py-2 text-2xl">
                    <span>{{ player.username }}</span>
                    <span class="bg-yellow-400 rounded-full border-2 border-gray-900 flex items-center justify-center font-bold" style="position:absolute; margin-top:-45px;;margin-left:140px; height:60px; width:60px">1</span>
                </div>
                <div v-else-if="i==1" class="bg-gray-300 rounded-full px-4 py-2 text-2xl">
                    <span>{{ player.username }}</span>
                    <span class="bg-gray-200 rounded-full border-2 border-gray-900 flex items-center justify-center font-bold" style="position:absolute; margin-top:-45px;;margin-left:140px; height:60px; width:60px">2</span>
                </div>
                <div v-else-if="i==2" class="bg-amber-700 rounded-full px-4 py-2 text-2xl">
                    <span>{{ player.username }}</span>
                    <span class="bg-amber-700 rounded-full border-2 border-gray-900 flex items-center justify-center font-bold" style="position:absolute; margin-top:-45px;;margin-left:140px; height:60px; width:60px">3</span>
                </div>
            </div>
        </div>
    </div>
</template>