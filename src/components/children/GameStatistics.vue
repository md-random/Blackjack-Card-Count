<template>
  <div class="game-statistics">
    <div>Wins: {{ statistics.wins }} ({{ winPercentage }})</div>
    <div>Pushes: {{ statistics.pushes }} ({{ pushPercentage }})</div>
    <div>Losses: {{ statistics.losses }} ({{ lossPercentage }})</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameStatistics } from '../interfaces/GameStatistics'

const props = defineProps<{
  statistics: GameStatistics
}>()

const totalGames = computed(
  () =>
    props.statistics.wins + props.statistics.pushes + props.statistics.losses
)

const formatPercentage = (value: number) => {
  if (totalGames.value === 0) return '0%'
  return `${((value / totalGames.value) * 100).toFixed(1)}%`
}

const winPercentage = computed(() => formatPercentage(props.statistics.wins))
const pushPercentage = computed(() => formatPercentage(props.statistics.pushes))
const lossPercentage = computed(() => formatPercentage(props.statistics.losses))
</script>

<style scoped>
.game-statistics {
  font-size: 14px;
}
</style>
