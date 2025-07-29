import { Deck, Card } from './models/card';

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startGame() {
    console.log('Welcome to Whot Card Game!');
    console.log('1. Play against Computer');
    console.log('2. Multiplayer Game');

    const answer = await new Promise<string>(resolve => {
        rl.question('Select game mode (1 or 2): ', resolve);
    });

    let players: string[] = [];
    
    if (answer === '1') {
        const playerName = await new Promise<string>(resolve => {
            rl.question('Enter your name: ', resolve);
        });
        players = [playerName, 'Computer'];
    } else if (answer === '2') {
        const playerCount = await new Promise<string>(resolve => {
            rl.question('Enter number of players (2-6): ', resolve);
        });
        const count = Math.min(Math.max(2, parseInt(playerCount)), 6);
        
        for (let i = 1; i <= count; i++) {
            const playerName = await new Promise<string>(resolve => {
                rl.question(`Enter Player ${i} name: `, resolve);
            });
            players.push(playerName);
        }
    }

    console.log(`Starting game with players: ${players.join(', ')}`);
    // Initialize deck and shuffle
    const deck = new Deck();
    deck.shuffle();

    // Deal cards to players
    const playerHands: { [key: string]: Card[] } = {};
    players.forEach(player => {
        playerHands[player] = [];
        for (let i = 0; i < 5; i++) {
            const card = deck.draw();
            if (card) {
                playerHands[player].push(card);
            }
        }
    });

    // Display hands
    players.forEach(player => {
        console.log(`${player}'s hand: ${playerHands[player].map(card => card.toString()).join(', ')}`);
    } );

    // Game logic here...
}

startGame();