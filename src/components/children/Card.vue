<template>
  <div
    class="card"
    :class="[props.card.suit, props.faceUp ? 'face-up' : 'face-down']"
  >
    <div v-if="props.faceUp" class="card-content">
      <div class="rank">{{ props.card.rank }}</div>
      <div class="suit">{{ suitSymbol }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '../interfaces/Card'

const props = defineProps<{
  card: Card
  faceUp: boolean
}>()

const suitSymbol = computed(() => {
  switch (props.card.suit) {
    case 'hearts':
      return '♥'
    case 'diamonds':
      return '♦'
    case 'clubs':
      return '♣'
    case 'spades':
      return '♠'
  }
})
</script>

<style scoped>
.card {
  border-radius: 5px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.face-up {
  background-color: #fff;
}

.face-down {
  background-color: #00008b;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hearts,
.diamonds {
  color: red;
}

.clubs,
.spades {
  color: black;
}
</style>
