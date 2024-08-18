# Vue 3 Blackjack Game

## Description

This is a Vue 3 component that implements the classic casino game Blackjack. It features a responsive design, customizable game settings, and an intuitive user interface.

## Features

- Play Blackjack against the dealer
- Responsive design for various screen sizes
- Customizable betting amounts
- Real-time bankroll updates
- Game over detection
- Dynamic UI that changes based on game state
- Split hands functionality
- Double down option
- Detailed game logs

## Blackjack Project Version History

- **Version 1.0**: Initial release with basic Blackjack gameplay

## Logic and Function Explanations

### Core Game Functions

- `placeBet(amount)`: Places a bet and starts a new hand
- `hit()`: Adds a card to the player's hand
- `stand()`: Ends the player's turn and starts the dealer's turn
- `split()`: Splits a pair into two separate hands
- `double()`: Doubles the bet and takes one more card
- `endRound()`: Evaluates the hands and determines the outcome

### Helper Functions

- `dealCard()`: Deals a card from the deck
- `updateHandValues()`: Calculates the value of a hand
- `isBlackjack(hand)`: Checks if a hand is a blackjack
- `isBusted(hand)`: Checks if a hand is busted

### Computed Properties

- `canSplit`: Determines if the player can split their hand
- `canDouble`: Determines if the player can double down
- `isHandInProgress`: Checks if a hand is currently being played

## How to Use

[Include instructions on how to integrate and use the component in a Vue 3 project]

## Customization

You can customize the game by modifying the following:

- Minimum and maximum bet amounts
- Number of decks used
- Blackjack payout ratio
- Dealer hit/stand on soft 17 rule

## Future Improvements

- Implement card counting assistance for learning

## License

This project is open source and available under the MIT License.
