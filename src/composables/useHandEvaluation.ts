import {
  calculateHandValue,
  isBlackjack,
  isBusted,
} from '../components/utils/deck'
import type { Ref } from 'vue'
import type { GameState } from '../components/interfaces/GameState'

export function useHandEvaluation() {
  const updateHandValues = (gameState: Ref<GameState>) => {
    gameState.value.playerHands.forEach((hand) => {
      hand.value = calculateHandValue(hand.cards)
    })
    gameState.value.dealerHands.forEach((hand) => {
      hand.value = calculateHandValue(hand.cards)
    })
  }

  const checkDealerBlackjack = (dealerHand: { cards: any[] }) => {
    if (isBlackjack(dealerHand.cards)) {
      return true
    }
    return false
  }

  return {
    calculateHandValue,
    isBlackjack,
    isBusted,
    updateHandValues,
    checkDealerBlackjack,
  }
}
