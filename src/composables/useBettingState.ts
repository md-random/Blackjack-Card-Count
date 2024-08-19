import { ref } from 'vue'
import type { BettingState } from '../components/interfaces/BettingState'

export function useBettingState(initialBankroll: number) {
  const bettingState = ref<BettingState>({
    bankroll: initialBankroll,
    currentBet: 0,
  })

  const placeBet = (amount: number) => {
    if (
      amount <= bettingState.value.bankroll &&
      amount >= 5 &&
      amount % 5 === 0
    ) {
      bettingState.value.currentBet = amount
      bettingState.value.bankroll -= amount
    }
  }

  return {
    bettingState,
    placeBet,
  }
}
