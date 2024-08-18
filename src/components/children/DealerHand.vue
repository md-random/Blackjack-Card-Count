<template>
  <div class="dealer-hand">
    <Card
      v-for="(card, index) in props.hand"
      :key="index"
      :card="card"
      :face-up="index === 0 || props.showAll"
    />
  </div>
</template>

<script setup lang="ts">
import Card from './Card.vue'
import type { Card as CardType } from '../interfaces/Card'

const props = defineProps<{
  hand: CardType[]
  showAll?: boolean
}>()
</script>

<style scoped>
.dealer-hand {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.dealer-hand .card {
  width: 60px;
  height: 90px;
  margin: 2px;
}
</style>
