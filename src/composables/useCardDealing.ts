import type { Ref } from 'vue'
import type { GameState } from '../components/interfaces/GameState'
import type { Card } from '../components/interfaces/Card'
import { createShoe, shuffleDeck } from '../components/utils/deck'

export function useCardDealing(numberOfShoes: number) {
  let deck: Card[] = []

  const initializeDeck = () => {
    deck = createShoe(numberOfShoes)
    shuffleDeck(deck)
  }

  const dealCard = (): Card => {
    if (deck.length === 0) {
      initializeDeck()
    }
    return deck.pop()!
  }

  const dealInitialCards = (gameState: Ref<GameState>) => {
    gameState.value.playerHands = [
      { cards: [dealCard(), dealCard()], value: 0 },
    ]
    gameState.value.dealerHands = [
      { cards: [dealCard(), dealCard()], value: 0 },
    ]
  }

  return {
    initializeDeck,
    dealCard,
    dealInitialCards,
  }
}
