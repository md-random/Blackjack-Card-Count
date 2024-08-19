<template>
  <div class="game-board">
    <div class="grid-item item1"></div>
    <div class="grid-item item2">
      <DealerHand
        :hand="gameState.dealerHands[0].cards"
        :show-all="gameOver || gameState.currentTurn === 'dealer'"
      />
    </div>
    <div class="grid-item item3">
      <DealerHand
        v-if="gameState.dealerHands.length > 1"
        :hand="gameState.dealerHands[1].cards"
        :show-all="true"
      />
    </div>
    <div class="grid-item item4">Version: 1.2</div>
    <div class="grid-item item5"></div>
    <div class="grid-item item6"></div>
    <div class="grid-item item7">
      <HandLog :logs="handLogs" />
    </div>
    <div class="grid-item item8"></div>
    <div class="grid-item item9"></div>
    <div class="grid-item item10">
      <GameControls
        :can-hit="canHit"
        :can-stand="canStand"
        :can-split="canSplit"
        :can-double="canDouble"
        @hit="hit"
        @stand="stand"
        @split="split"
        @double="double"
      />
      <GameStatistics :statistics="gameStatistics" />
    </div>
    <div class="grid-item item11">
      <BettingControls
        :bankroll="bettingState.bankroll"
        :current-bet="bettingState.currentBet"
        @place-bet="startNewHand"
      />
    </div>
    <div class="grid-item item12"></div>
    <div class="grid-item item13"></div>
    <div class="grid-item item14">
      <PlayerHand :hand="gameState.playerHands[0].cards" />
      <div
        v-if="
          gameState.playerHands.length > 1 && gameState.currentHandIndex === 0
        "
      >
        Playing first split hand
      </div>
    </div>
    <div class="grid-item item15">
      <PlayerHand
        v-if="gameState.playerHands.length > 1"
        :hand="gameState.playerHands[1].cards"
      />
      <div
        v-if="
          gameState.playerHands.length > 1 && gameState.currentHandIndex === 1
        "
      >
        Playing second split hand
      </div>
    </div>
    <div class="grid-item item16"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DealerHand from './children/DealerHand.vue'
import PlayerHand from './children/PlayerHand.vue'
import GameControls from './children/GameControls.vue'
import BettingControls from './children/BettingContols.vue'
import HandLog from './children/HandLog.vue'
import GameStatistics from './children/GameStatistics.vue'
import { useGameState } from '../composables/useGameState'
import { useBettingState } from '../composables/useBettingState'
import { useCardDealing } from '../composables/useCardDealing'
import { useHandEvaluation } from '../composables/useHandEvaluation'

const props = defineProps<{
  numberOfShoes: number
  initialBankroll: number
}>()

const emit = defineEmits<{
  (e: 'game-over'): void
}>()

const { bettingState, placeBet } = useBettingState(props.initialBankroll)
const { initializeDeck, dealCard, dealInitialCards } = useCardDealing(
  props.numberOfShoes
)
const {
  calculateHandValue,
  isBlackjack,
  isBusted,
  updateHandValues,
  checkDealerBlackjack,
} = useHandEvaluation()

const suitSymbols: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const {
  gameState,
  isHandInProgress,
  handLogs,
  gameStatistics,
  gameOver,
  currentHandNumber,
  canHit,
  canStand,
  canSplit,
  canDouble,
  moveToNextHand,
  endRound,
} = useGameState(bettingState)

const hit = () => {
  if (canHit.value) {
    const currentHand =
      gameState.value.playerHands[gameState.value.currentHandIndex]
    currentHand.cards.push(dealCard())
    updateHandValues(gameState)
    gameState.value.currentActions.push('hit')
    if (isBusted(currentHand.cards)) {
      moveToNextHand()
    }
  }
}

const stand = () => {
  gameState.value.currentActions.push('stand')
  moveToNextHand()
  if (gameState.value.currentTurn === 'dealer') {
    dealerPlay()
  }
}

const split = () => {
  if (canSplit.value) {
    const hand = gameState.value.playerHands[gameState.value.currentHandIndex]
    gameState.value.playerHands = [
      { cards: [hand.cards[0], dealCard()], value: 0 },
      { cards: [hand.cards[1], dealCard()], value: 0 },
    ]
    updateHandValues(gameState)
    bettingState.value.bankroll -= bettingState.value.currentBet
    bettingState.value.currentBet *= 2
    gameState.value.currentActions.push('split')
  }
}

const double = () => {
  if (canDouble.value) {
    hit()
    bettingState.value.bankroll -= bettingState.value.currentBet
    bettingState.value.currentBet *= 2
    gameState.value.currentActions.push('double')
    stand()
  }
}

const dealerPlay = () => {
  gameState.value.currentTurn = 'dealer'
  while (gameState.value.dealerHands[0].value < 17) {
    gameState.value.dealerHands[0].cards.push(dealCard())
    updateHandValues(gameState)
  }
  endRound()
}

const startNewHand = (amount: number) => {
  if (
    amount <= bettingState.value.bankroll &&
    amount >= 5 &&
    amount % 5 === 0 &&
    !isHandInProgress.value
  ) {
    placeBet(amount)
    isHandInProgress.value = true
    currentHandNumber.value++
    gameState.value = {
      deck: [],
      dealerHands: [{ cards: [], value: 0 }],
      playerHands: [{ cards: [], value: 0 }],
      currentHandIndex: 0,
      currentTurn: 'player',
      currentActions: [],
    }
    dealInitialCards(gameState)
    updateHandValues(gameState)
    gameOver.value = false

    if (checkDealerBlackjack(gameState.value.dealerHands[0])) {
      endRound()
    } else if (isBlackjack(gameState.value.playerHands[0].cards)) {
      endRound()
    }
  }
}

onMounted(() => {
  initializeDeck()
})
</script>

<style scoped>
.game-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  width: 100vw;
  height: 100vh;
}

.grid-item {
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.item4 {
  display: flex !important;
  justify-content: end !important;
  align-items: start !important;
  padding-right: 25px !important;
  color: blueviolet;
}
.item7 {
  overflow: hidden;
}

.item10 {
  display: flex;
  justify-content: space-around;
}
</style>
