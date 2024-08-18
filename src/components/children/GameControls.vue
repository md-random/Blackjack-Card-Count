<template>
  <div class="game-controls">
    <button @click="$emit('hit')" :disabled="!canHit">Hit</button>
    <button @click="$emit('stand')" :disabled="!canStand">Stand</button>
    <button @click="$emit('double')" :disabled="!canDouble">Double</button>
    <button @click="$emit('split')" :disabled="!canSplit">Split</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  canHit: boolean
  canStand: boolean
  canDouble: boolean
  canSplit: boolean
}>()

defineEmits(['hit', 'stand', 'double', 'split'])
</script>

<style scoped>
.game-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
