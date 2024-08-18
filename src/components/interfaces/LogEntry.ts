export interface LogEntry {
  actions: string[]
  bet: number
  bankrollBefore: number
  bankrollAfter: number
  outcome: string
  playerHand: string[]
  dealerHand: string[]
  handIndex: string
}
