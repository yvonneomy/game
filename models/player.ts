import { Card } from './card';

export class Player {
    private hand: Card[] = [];

    constructor(public name: string) {}

    addCard(card: Card) {
        this.hand.push(card);
    }

    playCard(card: Card): boolean {
        const index = this.hand.findIndex(c => c.shape === card.shape && c.number === card.number);
        if (index !== -1) {
            this.hand.splice(index, 1);
            return true;
        }
        return false;
    }

    getPlayableCards(topCard: Card): Card[] {
        return this.hand.filter(card => card.matches(topCard));
    }

    getHand(): Card[] {
        return [...this.hand];
    }

    hasWon(): boolean {
        return this.hand.length === 0;
    }
}
