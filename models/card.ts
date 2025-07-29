export enum CardShape {
    Circle = 1,
    Triangle = 2,
    Cross = 3,
    Square = 4,
    Star = 5,
    Whot = 20
}

export class Card {
    constructor(
        public shape: number,
        public number: number
    ) {}

    toString(): string {
        const shapeName = CardShape[this.shape] || this.shape;
        return `${this.number} of ${shapeName}`;
    }

    matches(other: Card): boolean {
        return this.shape === other.shape || this.number === other.number;
    }

    isSpecial(): boolean {
        return this.number === 1 || // Hold on
               this.number === 2 || // Pick two
               this.number === 5 || // Pick three
               this.number === 8 || // Suspension
               this.number === 14 || // General Market
               this.shape === CardShape.Whot; // Whot card
    }

    getSpecialEffect(): string {
        switch(this.number) {
            case 1: return 'HOLD_ON';
            case 2: return 'PICK_TWO';
            case 5: return 'PICK_THREE';
            case 8: return 'SUSPENSION';
            case 14: return 'GENERAL_MARKET';
            default: return this.shape === CardShape.Whot ? 'WHOT' : 'NONE';
        }
    }
}

export class Deck {
    private cards: Card[] = [];

    constructor() {
        this.initializeDeck();
    }

    private initializeDeck() {
        // Regular cards
        for (let shape = 1; shape <= 5; shape++) {
            for (let number = 1; number <= 14; number++) {
                this.cards.push(new Card(shape, number));
            }
        }
        // Add Whot cards
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(CardShape.Whot, 20));
        }
    }

    shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(): Card | undefined {
        return this.cards.pop();
    }
}
