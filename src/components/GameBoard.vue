<template>
  <div class="game-board">
    <div class="grid-item item1"></div>
    <div class="grid-item item2">
      <DealerHand :hand="gameState.dealerHands[0].cards" :show-all="gameOver" />
    </div>
    <div class="grid-item item3">
      <DealerHand
        v-if="gameState.dealerHands.length > 1"
        :hand="gameState.dealerHands[1].cards"
        :show-all="true"
      />
    </div>
    <div class="grid-item item4">Version: 1.1</div>
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
        @place-bet="placeBet"
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
import { ref, computed, onMounted } from 'vue'
import DealerHand from './children/DealerHand.vue'
import PlayerHand from './children/PlayerHand.vue'
import GameControls from './children/GameControls.vue'
import BettingControls from './children/BettingContols.vue'
import HandLog from './children/HandLog.vue'
import GameStatistics from './children/GameStatistics.vue'
import {
  createShoe,
  shuffleDeck,
  calculateHandValue,
  isBlackjack,
  isBusted,
} from './utils/deck'
import type { Card } from './interfaces/Card'
import type { Hand } from './interfaces/Hand'
import type { GameState } from './interfaces/GameState'
import type { BettingState } from './interfaces/BettingState'
import type { GameStatistics as Stats } from './interfaces/GameStatistics'
import type { LogEntry } from './interfaces/LogEntry'

const props = defineProps<{
  numberOfShoes: number
  initialBankroll: number
}>()

const emit = defineEmits<{
  (e: 'game-over'): void
}>()

const isHandInProgress = ref(false)
const handLogs = ref<LogEntry[]>([])
const gameStatistics = ref<Stats>({ wins: 0, pushes: 0, losses: 0 })
const gameOver = ref(false)
const currentHandNumber = ref(0)

const suitSymbols: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const gameState = ref<GameState>({
  deck: [],
  dealerHands: [{ cards: [], value: 0 }],
  playerHands: [{ cards: [], value: 0 }],
  currentHandIndex: 0,
  currentTurn: 'player',
  currentActions: [],
})

const bettingState = ref<BettingState>({
  bankroll: props.initialBankroll,
  currentBet: 0,
})

const canHit = computed(
  () =>
    !gameOver.value &&
    gameState.value.currentTurn === 'player' &&
    gameState.value.playerHands[gameState.value.currentHandIndex].cards.length >
      0 &&
    bettingState.value.currentBet > 0
)

const canStand = computed(
  () =>
    !gameOver.value &&
    gameState.value.currentTurn === 'player' &&
    gameState.value.playerHands[gameState.value.currentHandIndex].cards.length >
      0 &&
    bettingState.value.currentBet > 0
)

const canSplit = computed(() => {
  const hand = gameState.value.playerHands[0]
  return (
    !gameOver.value &&
    hand.cards.length === 2 &&
    hand.cards[0].rank === hand.cards[1].rank &&
    bettingState.value.bankroll >= bettingState.value.currentBet
  )
})
const canDouble = computed(() => {
  const hand = gameState.value.playerHands[0]
  return (
    !gameOver.value &&
    hand.cards.length === 2 &&
    bettingState.value.bankroll >= bettingState.value.currentBet
  )
})

const initializeDeck = () => {
  gameState.value.deck = createShoe(props.numberOfShoes)
}

const dealCard = (): Card => {
  if (gameState.value.deck.length === 0) {
    initializeDeck()
  }
  return gameState.value.deck.pop()!
}

const dealInitialCards = () => {
  gameState.value.playerHands = [{ cards: [dealCard(), dealCard()], value: 0 }]
  gameState.value.dealerHands = [{ cards: [dealCard(), dealCard()], value: 0 }]
  updateHandValues()
  gameState.value.currentTurn = 'player'
  gameOver.value = false

  if (checkDealerBlackjack()) {
    endRound()
  } else if (isBlackjack(gameState.value.playerHands[0].cards)) {
    endRound()
  }
}

const checkDealerBlackjack = () => {
  const dealerHand = gameState.value.dealerHands[0]
  if (isBlackjack(dealerHand.cards)) {
    gameState.value.currentTurn = 'dealer'
    return true
  }
  return false
}

const updateHandValues = () => {
  gameState.value.playerHands.forEach((hand) => {
    hand.value = calculateHandValue(hand.cards)
  })
  gameState.value.dealerHands.forEach((hand) => {
    hand.value = calculateHandValue(hand.cards)
  })
}

const hit = () => {
  if (canHit.value) {
    const currentHand =
      gameState.value.playerHands[gameState.value.currentHandIndex]
    currentHand.cards.push(dealCard())
    updateHandValues()
    gameState.value.currentActions.push('hit')
    if (isBusted(currentHand.cards)) {
      moveToNextHand()
    }
  }
}

const stand = () => {
  gameState.value.currentActions.push('stand')
  moveToNextHand()
}

const moveToNextHand = () => {
  if (
    gameState.value.currentHandIndex <
    gameState.value.playerHands.length - 1
  ) {
    gameState.value.currentHandIndex++
    gameState.value.currentActions = []
  } else {
    gameState.value.currentTurn = 'dealer'
    if (!gameState.value.playerHands.every((hand) => isBusted(hand.cards))) {
      dealerPlay()
    } else {
      endRound()
    }
  }
}

const split = () => {
  if (canSplit.value) {
    const hand = gameState.value.playerHands[gameState.value.currentHandIndex]
    gameState.value.playerHands = [
      { cards: [hand.cards[0], dealCard()], value: 0 },
      { cards: [hand.cards[1], dealCard()], value: 0 },
    ]
    updateHandValues()
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
  }
}

const dealerPlay = () => {
  while (gameState.value.dealerHands[0].value < 17) {
    gameState.value.dealerHands[0].cards.push(dealCard())
    updateHandValues()
  }
  endRound()
}

const endRound = () => {
  gameOver.value = true
  const dealerValue = gameState.value.dealerHands[0].value

  gameState.value.playerHands.forEach((playerHand, index) => {
    const logEntry: LogEntry = {
      actions:
        index === 0
          ? gameState.value.currentActions
          : [
              'split',
              ...gameState.value.currentActions.filter(
                (action) => action !== 'split'
              ),
            ],
      bet: bettingState.value.currentBet / gameState.value.playerHands.length,
      bankrollBefore:
        bettingState.value.bankroll + bettingState.value.currentBet,
      bankrollAfter: bettingState.value.bankroll,
      outcome: '',
      playerHand: playerHand.cards.map(
        (card) => `${card.rank}${suitSymbols[card.suit]}`
      ),
      dealerHand: gameState.value.dealerHands[0].cards.map(
        (card) => `${card.rank}${suitSymbols[card.suit]}`
      ),
      handIndex:
        gameState.value.playerHands.length > 1
          ? `${currentHandNumber.value}${String.fromCharCode(97 + index)}`
          : `${currentHandNumber.value}`,
    }

    const playerValue = playerHand.value

    if (isBusted(playerHand.cards)) {
      gameStatistics.value.losses++
      logEntry.outcome = 'Bust'
    } else if (
      isBlackjack(playerHand.cards) &&
      !isBlackjack(gameState.value.dealerHands[0].cards)
    ) {
      bettingState.value.bankroll +=
        (bettingState.value.currentBet / gameState.value.playerHands.length) *
        2.5
      gameStatistics.value.wins++
      logEntry.outcome = 'Blackjack'
    } else if (isBusted(gameState.value.dealerHands[0].cards)) {
      bettingState.value.bankroll +=
        (bettingState.value.currentBet / gameState.value.playerHands.length) * 2
      gameStatistics.value.wins++
      logEntry.outcome = 'Dealer Bust'
    } else if (playerValue > dealerValue) {
      bettingState.value.bankroll +=
        (bettingState.value.currentBet / gameState.value.playerHands.length) * 2
      gameStatistics.value.wins++
      logEntry.outcome = 'Win'
    } else if (playerValue < dealerValue) {
      gameStatistics.value.losses++
      logEntry.outcome = 'Loss'
    } else {
      bettingState.value.bankroll +=
        bettingState.value.currentBet / gameState.value.playerHands.length
      gameStatistics.value.pushes++
      logEntry.outcome = 'Push'
    }

    logEntry.bankrollAfter = bettingState.value.bankroll

    handLogs.value.unshift(logEntry)
  })

  if (bettingState.value.bankroll <= 0) {
    emit('game-over')
  }

  bettingState.value.currentBet = 0
  gameState.value.currentActions = []
  gameState.value.currentHandIndex = 0
  isHandInProgress.value = false
}

const placeBet = (amount: number) => {
  if (
    amount <= bettingState.value.bankroll &&
    amount >= 5 &&
    amount % 5 === 0 &&
    !isHandInProgress.value
  ) {
    bettingState.value.currentBet = amount
    bettingState.value.bankroll -= amount
    isHandInProgress.value = true
    currentHandNumber.value++
    dealInitialCards()
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
