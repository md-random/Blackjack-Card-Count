<template>
  <div class="player-hand">
    <Card
      v-for="(card, index) in props.hand"
      :key="index"
      :card="card"
      :face-up="true"
    />
  </div>
</template>

<script setup lang="ts">
import Card from './Card.vue'
import type { Card as CardType } from '../interfaces/Card'

const props = defineProps<{
  hand: CardType[]
}>()
</script>

<style scoped>
.player-hand {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.player-hand :deep(.card) {
  width: 60px;
  height: 90px;
  margin: 2px;
}
</style>
