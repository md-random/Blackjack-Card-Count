<template>
  <div class="app">
    <GameSetup v-if="!isGameStarted" @start-game="startGame" />
    <GameBoard
      v-else
      :number-of-shoes="numberOfShoes"
      :initial-bankroll="initialBankroll"
      @game-over="restartGame"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GameBoard from './components/GameBoard.vue'
import GameSetup from './components/GameSetup.vue'

const isGameStarted = ref(false)
const numberOfShoes = ref(1)
const initialBankroll = ref(1000)

const startGame = (shoes: number, bankroll: number) => {
  numberOfShoes.value = shoes
  initialBankroll.value = bankroll
  isGameStarted.value = true
}

const restartGame = () => {
  isGameStarted.value = false
}
</script>

<style scoped>
.app {
}
</style>
