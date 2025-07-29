import { WhotGame } from './game';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startGame() {
    console.log('Welcome to Whot Card Game!');
    console.log('1. Play against Computer');
    console.log('2. Player vs Player');

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
        const player1 = await new Promise<string>(resolve => {
            rl.question('Enter Player 1 name: ', resolve);
        });
        const player2 = await new Promise<string>(resolve => {
            rl.question('Enter Player 2 name: ', resolve);
        });
        players = [player1, player2];
    }

    rl.close();

    if (players.length > 0) {
        const game = new WhotGame(players);
        game.start();
    }
}

startGame();
