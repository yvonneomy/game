import { Card, Deck } from './models/card';
import { Player } from './models/player';
import { AIPlayer } from './models/ai-player';
import * as readline from 'readline';

export class WhotGame {
    private deck: Deck;
    private players: Player[];
    private currentPlayerIndex: number = 0;
    private direction: number = 1; // 1 for clockwise, -1 for counter-clockwise
    private topCard?: Card;
    private rl: readline.Interface;
    private pendingCards: number = 0;
    private scores: Map<string, number> = new Map();
    private experience: Map<string, number> = new Map();

    constructor(playerNames: string[]) {
        if (playerNames.length < 2 || playerNames.length > 6) {
            throw new Error('Game requires 2-6 players');
        }

        this.deck = new Deck();
        this.players = playerNames.map(name => 
            name === 'Computer' ? new AIPlayer(name) : new Player(name)
        );
        playerNames.forEach(name => {
            this.scores.set(name, 0);
            this.experience.set(name, 0);
        });
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.startGame();
    }

    private startGame() {
        this.deck.shuffle();
        for (let player of this.players) {
            this.drawCards(player, 5);
        }
        this.topCard = this.deck.draw();
        this.play();
    }

    private async play() {
        while (true) {
            await this.playTurn();
            if (this.checkWinCondition()) break;
        }
        this.rl.close();
    }

    private calculateScore(player: Player): number {
        const remainingCards = player.getHand();
        return remainingCards.reduce((total, card) => {
            if (card.isSpecial()) return total + 20;
            return total + card.number;
        }, 0);
    }

    private updateExperience(player: Player, points: number) {
        const currentExp = this.experience.get(player.name) || 0;
        this.experience.set(player.name, currentExp + points);
        console.log(`${player.name} gained ${points} experience points!`);
        
        // Level up system
        const level = Math.floor(currentExp / 100) + 1;
        console.log(`${player.name} is level ${level}`);
    }

    private checkWinCondition(): boolean {
        for (let player of this.players) {
            if (player.getCardCount() === 0) {
                // Calculate and update scores
                const winBonus = 50;
                const score = winBonus + this.players.reduce((total, p) => {
                    if (p !== player) {
                        return total + this.calculateScore(p);
                    }
                    return total;
                }, 0);

                const currentScore = this.scores.get(player.name) || 0;
                this.scores.set(player.name, currentScore + score);
                
                // Award experience
                this.updateExperience(player, score);
                
                console.log(`\n=== Game Over ===`);
                console.log(`${player.name} wins with ${score} points!`);
                console.log('\nFinal Scores:');
                this.scores.forEach((score, name) => {
                    const exp = this.experience.get(name);
                    const level = Math.floor((exp || 0) / 100) + 1;
                    console.log(`${name}: ${score} points (Level ${level}, Exp: ${exp})`);
                });
                return true;
            }
        }
        return false;
    }

    private async playTurn() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        console.log(`\nTop Card: ${this.topCard?.toString()}`);
        console.log(`${currentPlayer.name}'s turn`);

        if (this.pendingCards > 0) {
            const playableCards = currentPlayer.getPlayableCards(this.topCard!)
                .filter(card => card.number === this.topCard?.number);
            
            if (playableCards.length === 0) {
                console.log(`Drawing ${this.pendingCards} cards...`);
                this.drawCards(currentPlayer, this.pendingCards);
                this.pendingCards = 0;
            } else {
                // Player can defend with matching card
                const cardIndex = await this.getPlayerChoice(currentPlayer, playableCards);
                const selectedCard = playableCards[cardIndex];
                currentPlayer.playCard(selectedCard);
                this.topCard = selectedCard;
                await this.handleSpecialCard(selectedCard);
            }
        } else {
            // Normal turn
            const playableCards = currentPlayer.getPlayableCards(this.topCard!);
            if (playableCards.length > 0) {
                const cardIndex = await this.getPlayerChoice(currentPlayer, playableCards);
                const selectedCard = playableCards[cardIndex];
                currentPlayer.playCard(selectedCard);
                this.topCard = selectedCard;
                await this.handleSpecialCard(selectedCard);
            } else {
                console.log('No playable cards, drawing from deck...');
                this.drawCards(currentPlayer, 1);
            }
        }

        this.currentPlayerIndex = this.getNextPlayerIndex();
    }

    private async getPlayerChoice(player: Player, playableCards: Card[]): Promise<number> {
        if (player instanceof AIPlayer) {
            const selectedCard = (player as AIPlayer).chooseCard(this.topCard!);
            const index = playableCards.findIndex(card => 
                card.shape === selectedCard.shape && card.number === selectedCard.number
            );
            return Promise.resolve(index);
        }

        return new Promise((resolve) => {
            this.rl.question(`${player.name}, choose a card to play (1-${playableCards.length}): `, (answer) => {
                const index = parseInt(answer) - 1;
                resolve(isNaN(index) || index < 0 || index >= playableCards.length ? 0 : index);
            });
        });
    }

    private async handleSpecialCard(card: Card) {
        if (!card.isSpecial()) return;

        const effect = card.getSpecialEffect();
        const nextPlayerIndex = this.getNextPlayerIndex();

        switch(effect) {
            case 'PICK_TWO':
                this.pendingCards += 2;
                break;
            case 'PICK_THREE':
                this.pendingCards += 3;
                break;
            case 'HOLD_ON':
                this.direction *= -1;
                break;
            case 'SUSPENSION':
                this.currentPlayerIndex = this.getNextPlayerIndex();
                break;
            case 'GENERAL_MARKET':
                for (let player of this.players) {
                    if (player !== this.players[this.currentPlayerIndex]) {
                        this.drawCards(player, 1);
                    }
                }
                break;
            case 'WHOT':
                const shape = await this.askForShape();
                this.topCard = new Card(shape, card.number);
                break;
        }

        // Award experience for special card plays
        const currentPlayer = this.players[this.currentPlayerIndex];
        this.updateExperience(currentPlayer, 10);
    }

    private async askForShape(): Promise<number> {
        return new Promise((resolve) => {
            this.rl.question('Choose shape (1-Circle, 2-Triangle, 3-Cross, 4-Square, 5-Star): ', (answer) => {
                const shape = parseInt(answer);
                resolve(shape >= 1 && shape <= 5 ? shape : 1);
            });
        });
    }

    private getNextPlayerIndex(): number {
        return (this.currentPlayerIndex + this.direction + this.players.length) % this.players.length;
    }

    private drawCards(player: Player, count: number) {
        for (let i = 0; i < count; i++) {
            const card = this.deck.draw();
            if (card) player.addCard(card);
        }
    }
}