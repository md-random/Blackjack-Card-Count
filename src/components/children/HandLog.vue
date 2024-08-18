<template>
  <div class="hand-log">
    <div class="log-container">
      <div v-for="(log, index) in logs" :key="index" class="log-entry">
        <div>Hand #{{ log.handIndex ? log.handIndex : '' }}</div>
        <div>
          Player's Hand: <span v-html="formatHand(log.playerHand)"></span>
        </div>
        <div>
          Dealer's Hand: <span v-html="formatHand(log.dealerHand)"></span>
        </div>
        <div>Actions: {{ log.actions.join(', ') }}</div>
        <div>Bet: ${{ log.bet }}</div>
        <div>Bankroll before: ${{ log.bankrollBefore }}</div>
        <div>Bankroll after: ${{ log.bankrollAfter }}</div>
        <div>Outcome: {{ log.outcome }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogEntry } from '../interfaces/LogEntry'

const props = defineProps<{
  logs: LogEntry[]
}>()

const formatHand = (hand: string[]) => {
  return hand
    .map((card) => {
      const [rank, suit] = card.split('')
      const color = suit === '♥' || suit === '♦' ? 'red' : 'black'
      return `<span style="color: ${color}">${rank}${suit}</span>`
    })
    .join(', ')
}
</script>

<style scoped>
.hand-log {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.log-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.log-entry {
  border-bottom: 1px solid #ccc;
  padding: 5px;
  font-size: 12px;
}
</style>
