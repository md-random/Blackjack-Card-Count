<template>
  <div class="betting-controls">
    <div>Bankroll: ${{ bankroll }}</div>
    <div>Current Bet: ${{ currentBet }}</div>
    <input
      type="number"
      v-model="betAmount"
      :min="5"
      :max="bankroll"
      :step="5"
      :disabled="isHandInProgress"
    />
    <button @click="placeBet" :disabled="isHandInProgress || !isValidBet">
      Place Bet
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  bankroll: number
  currentBet: number
  isHandInProgress: boolean
}>()

const emit = defineEmits(['place-bet'])

const betAmount = ref(5)

const isValidBet = computed(() => {
  return (
    betAmount.value >= 5 &&
    betAmount.value <= props.bankroll &&
    betAmount.value % 5 === 0
  )
})

const placeBet = () => {
  if (isValidBet.value) {
    emit('place-bet', betAmount.value)
  }
}
</script>

<style scoped>
.betting-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 5px;
  font-size: 14px;
}

button {
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
