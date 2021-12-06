<script setup lang="ts">
import Grille from "../components/Grille.vue";
</script>

<template>
  <div class="flex justify-around h-screen bg-red-600">
    <Grille :roomId="1235612" gridId="Dark" />
  </div>
</template>
