import { Card, Deck } from './card';
import { Player } from './player';
import * as readline from 'readline';

export class WhotGame {
    private deck: Deck;
    private players: Player[];
    private currentPlayerIndex: number = 0;
    private topCard?: Card;
    private rl: readline.Interface;

    constructor(playerNames: string[]) {
        this.deck = new Deck();
        this.players = playerNames.map(name => new Player(name));
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async start() {
        this.deck.shuffle();
        this.dealInitialCards();
        this.topCard = this.deck.draw();

        while (!this.isGameOver()) {
            await this.playTurn();
        }

        const winner = this.players.find(p => p.hasWon());
        console.log(`Game Over! ${winner?.name} wins!`);
        this.rl.close();
    }

    private dealInitialCards() {
        // Deal 5 cards to each player
        for (let i = 0; i < 5; i++) {
            this.players.forEach(player => {
                const card = this.deck.draw();
                if (card) player.addCard(card);
            });
        }
    }

    private async playTurn() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        console.log(`\nTop Card: ${this.topCard?.toString()}`);
        console.log(`${currentPlayer.name}'s turn`);
        
        const playableCards = currentPlayer.getPlayableCards(this.topCard!);
        
        if (playableCards.length > 0) {
            const cardIndex = await this.getPlayerChoice(currentPlayer, playableCards);
            const selectedCard = playableCards[cardIndex];
            currentPlayer.playCard(selectedCard);
            this.topCard = selectedCard;
        } else {
            console.log('No playable cards, drawing from deck...');
            const drawnCard = this.deck.draw();
            if (drawnCard) {
                currentPlayer.addCard(drawnCard);
            }
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    private async getPlayerChoice(player: Player, playableCards: Card[]): Promise<number> {
        return new Promise((resolve) => {
            console.log('Your hand:');
            playableCards.forEach((card, index) => {
                console.log(`${index + 1}: ${card.toString()}`);
            });

            this.rl.question('Choose a card to play (enter number): ', (answer) => {
                const choice = parseInt(answer) - 1;
                if (choice >= 0 && choice < playableCards.length) {
                    resolve(choice);
                } else {
                    resolve(0);
                }
            });
        });
    }

    private isGameOver(): boolean {
        return this.players.some(p => p.hasWon());
    }
}
