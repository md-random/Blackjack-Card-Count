import { ref, computed } from 'vue'
import type { GameState } from '../components/interfaces/GameState'
import type { LogEntry } from '../components/interfaces/LogEntry'
import type { GameStatistics } from '../components/interfaces/GameStatistics'
import type { Ref } from 'vue'
import type { BettingState } from '../components/interfaces/BettingState'
import { isBlackjack, isBusted } from '../components/utils/deck'

export function useGameState(bettingState: Ref<BettingState>) {
  const gameState = ref<GameState>({
    deck: [],
    dealerHands: [{ cards: [], value: 0 }],
    playerHands: [{ cards: [], value: 0 }],
    currentHandIndex: 0,
    currentTurn: 'player',
    currentActions: [],
  })

  const isHandInProgress = ref(false)
  const handLogs = ref<LogEntry[]>([])
  const gameStatistics = ref<GameStatistics>({ wins: 0, pushes: 0, losses: 0 })
  const gameOver = ref(false)
  const currentHandNumber = ref(0)

  const suitSymbols: Record<string, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  }

  const canHit = computed(
    () =>
      !gameOver.value &&
      gameState.value.currentTurn === 'player' &&
      gameState.value.playerHands[gameState.value.currentHandIndex].cards
        .length > 0
  )

  const canStand = computed(
    () =>
      !gameOver.value &&
      gameState.value.currentTurn === 'player' &&
      gameState.value.playerHands[gameState.value.currentHandIndex].cards
        .length > 0
  )

  const canSplit = computed(() => {
    const hand = gameState.value.playerHands[0]
    return (
      !gameOver.value &&
      hand.cards.length === 2 &&
      hand.cards[0].rank === hand.cards[1].rank
    )
  })

  const canDouble = computed(() => {
    const hand = gameState.value.playerHands[0]
    return !gameOver.value && hand.cards.length === 2
  })

  const moveToNextHand = () => {
    if (
      gameState.value.currentHandIndex <
      gameState.value.playerHands.length - 1
    ) {
      gameState.value.currentHandIndex++
      gameState.value.currentActions = []
    } else {
      gameState.value.currentTurn = 'dealer'
    }
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

      if (
        isBlackjack(playerHand.cards) &&
        !isBlackjack(gameState.value.dealerHands[0].cards)
      ) {
        bettingState.value.bankroll +=
          (bettingState.value.currentBet / gameState.value.playerHands.length) *
          2.5
        gameStatistics.value.wins++
        logEntry.outcome = 'Blackjack'
      } else if (isBusted(playerHand.cards)) {
        gameStatistics.value.losses++
        logEntry.outcome = 'Bust'
      } else if (isBusted(gameState.value.dealerHands[0].cards)) {
        bettingState.value.bankroll +=
          (bettingState.value.currentBet / gameState.value.playerHands.length) *
          2
        gameStatistics.value.wins++
        logEntry.outcome = 'Dealer Bust'
      } else if (playerValue > dealerValue) {
        bettingState.value.bankroll +=
          (bettingState.value.currentBet / gameState.value.playerHands.length) *
          2
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

    bettingState.value.currentBet = 0
    gameState.value.currentActions = []
    gameState.value.currentHandIndex = 0
    isHandInProgress.value = false
  }

  return {
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
  }
}
