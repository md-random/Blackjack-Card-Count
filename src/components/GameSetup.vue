<template>
  <div class="game-setup">
    <h2>Game Setup</h2>
    <div>
      <label for="shoes">Number of Shoes (1-6):</label>
      <input id="shoes" v-model="shoes" type="number" min="1" max="6" />
    </div>
    <div>
      <label for="bankroll">Initial Bankroll ($1,000 - $100,000):</label>
      <input
        id="bankroll"
        v-model="bankroll"
        type="number"
        min="1000"
        max="100000"
        step="1000"
      />
    </div>
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'start-game', shoes: number, bankroll: number): void
}>()

const shoes = ref(1)
const bankroll = ref(1000)

const startGame = () => {
  emit('start-game', shoes.value, bankroll.value)
}
</script>

<style scoped>
.game-setup {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
