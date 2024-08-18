import { Card } from './Card'
import { Hand } from './Hand'

export type Turn = 'player' | 'dealer'

export interface GameState {
  deck: Card[]
  dealerHands: Hand[]
  playerHands: Hand[]
  currentHandIndex: number
  currentTurn: 'player' | 'dealer'
  currentActions: string[]
}
