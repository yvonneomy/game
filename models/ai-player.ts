import { Card } from './card';
import { Player } from './player';

export class AIPlayer extends Player {
    chooseCard(topCard: Card): Card {
        const playableCards = this.getPlayableCards(topCard);
        if (playableCards.length === 0) return null;

        // Prioritize special cards
        const specialCards = playableCards.filter(card => card.isSpecial());
        if (specialCards.length > 0) {
            return specialCards[0];
        }

        // Otherwise play the highest number card
        return playableCards.reduce((prev, curr) => 
            curr.number > prev.number ? curr : prev
        );
    }

    chooseShape(): number {
        // Count shapes in hand and choose most frequent
        const shapeCounts = new Map<number, number>();
        this.getHand().forEach(card => {
            shapeCounts.set(card.shape, (shapeCounts.get(card.shape) || 0) + 1);
        });
        
        let maxShape = 1;
        let maxCount = 0;
        shapeCounts.forEach((count, shape) => {
            if (count > maxCount) {
                maxCount = count;
                maxShape = shape;
            }
        });
        return maxShape;
    }
}
