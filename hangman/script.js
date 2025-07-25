const easyWords = [
    // Everyday
    { word: 'CAT', hint: 'A common household pet that meows' },
    { word: 'DOG', hint: 'Man\'s best friend' },
    { word: 'FISH', hint: 'Lives in water' },
    { word: 'BOOK', hint: 'Contains stories to read' },
    { word: 'TREE', hint: 'Grows in nature with leaves' },
    { word: 'CAR', hint: 'Has wheels and drives on roads' },
    { word: 'RAIN', hint: 'Water falling from the sky' },
    { word: 'MOON', hint: 'Lights up the night sky' },
    { word: 'BAG', hint: 'Used to carry things' },
    { word: 'HAT', hint: 'Worn on your head' },

    // Destinations
    { word: 'PARIS', hint: 'City of lights and Eiffel Tower' },
    { word: 'ROME', hint: 'Ancient capital with Colosseum' },
    { word: 'BALI', hint: 'Tropical Indonesian paradise' },
    { word: 'DUBAI', hint: 'Middle Eastern city with Burj Khalifa' },
    { word: 'VENICE', hint: 'City of canals in Italy' },

    // Movies
    { word: 'UP', hint: 'Flying house with balloons' },
    { word: 'FROZEN', hint: 'Let it go!' },
    { word: 'COCO', hint: 'A Pixar film about Día de los Muertos' },

    // Books
    { word: 'IT', hint: 'Stephen King horror about a clown' },
    { word: 'HOBBIT', hint: 'Prequel to the Lord of the Rings' },

    // Compound Words
    { word: 'TOOTHBRUSH', hint: 'Used to clean your teeth' },
    { word: 'NOTEBOOK', hint: 'Used to take notes' },
    { word: 'SUNFLOWER', hint: 'A yellow plant that faces the sun' },
    { word: 'SNOWMAN', hint: 'Made of snow in winter' },
    { word: 'LADYBUG', hint: 'A red insect with black spots' }
];


const hardWords = [
    // Everyday / Concepts
    { word: 'MYSTERIOUS', hint: 'Difficult to understand or explain' },
    { word: 'PNEUMONIA', hint: 'A serious lung infection' },
    { word: 'RHYTHM', hint: 'Musical timing or beat' },
    { word: 'QUANTUM', hint: 'Related to atomic scale physics' },

    // Destinations
    { word: 'KYOTO', hint: 'Traditional city in Japan' },
    { word: 'SYDNEY', hint: 'Australian city with Opera House' },
    { word: 'CAIRO', hint: 'City near the Great Pyramids' },
    { word: 'NEWYORK', hint: 'Big Apple' },
    { word: 'LONDON', hint: 'Home to Big Ben and the Queen' },

    // Movies
    { word: 'INCEPTION', hint: 'Dream within a dream' },
    { word: 'TITANIC', hint: 'Famous shipwreck love story' },
    { word: 'GLADIATOR', hint: 'Roman warrior epic' },
    { word: 'AVATAR', hint: 'Blue aliens and Pandora' },
    { word: 'JOKER', hint: 'Iconic Batman villain gets his own story' },

    // Books
    { word: 'FRANKENSTEIN', hint: 'Man creates a monster' },
    { word: 'DRACULA', hint: 'Classic vampire tale' },
    { word: '1984', hint: 'Dystopian future by George Orwell' },
    { word: 'DUNE', hint: 'Sci-fi novel set on desert planet Arrakis' },
    { word: 'TWILIGHT', hint: 'Vampire-human love story' },

    // Philosophers
    { word: 'SOCRATES', hint: 'Ancient Greek, known for questions' },
    { word: 'PLATO', hint: 'Student of Socrates, wrote The Republic' },
    { word: 'NIETZSCHE', hint: 'Said "God is dead"' },
    { word: 'ARISTOTLE', hint: 'Taught Alexander the Great' },
    { word: 'CONFUCIUS', hint: 'Chinese philosopher of virtue and ethics' },

    // Compound
    { word: 'MAILBOX', hint: 'Receives letters' }
];


class HangmanGame {
    constructor() {
        this.maxTries = 6;
        this.currentWord = '';
        this.guessedLetters = new Set();
        this.remainingTries = 6;
        this.isHardMode = false;
        this.currentHint = '';

        this.hangmanStates = [
            this.drawBase,
            this.drawHead,
            this.drawBody,
            this.drawLeftArm,
            this.drawRightArm,
            this.drawLeftLeg,
            this.drawRightLeg
        ];

        this.initializeGame();
    }

    initializeGame() {
        document.getElementById('easyBtn').addEventListener('click', () => this.startNewGame(false));
        document.getElementById('hardBtn').addEventListener('click', () => this.startNewGame(true));
        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame(this.isHardMode));
        this.createKeyboard();
    }

    startNewGame(isHard) {
        const canvas = document.getElementById('hangman-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.isHardMode = isHard;
        this.remainingTries = isHard ? 4 : 6;
        this.guessedLetters.clear();
        this.currentWord = this.getRandomWord(isHard);
        this.updateDisplay();
        this.resetKeyboard();
    }

    getRandomWord(isHard) {
        const words = isHard ? hardWords : easyWords;
        const wordObj = words[Math.floor(Math.random() * words.length)];
        this.currentHint = wordObj.hint;
        return wordObj.word;
    }

    createKeyboard() {
        const keyboard = document.getElementById('keyboard');
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.className = 'keyboard-btn';
            button.setAttribute('data-letter', letter);
            button.addEventListener('click', () => this.makeGuess(letter));
            keyboard.appendChild(button);
        });
    }

    resetKeyboard() {
        document.querySelectorAll('.keyboard-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.backgroundColor = '';
        });
    }

    makeGuess(letter) {
        if (this.guessedLetters.has(letter)) return;

        this.guessedLetters.add(letter);
        const button = document.querySelector(`.keyboard-btn[data-letter="${letter}"]`);
        
        if (this.currentWord.includes(letter)) {
            button.style.backgroundColor = '#4CAF50'; // Green for correct guesses
        } else {
            button.style.backgroundColor = '#f44336'; // Red for wrong guesses
            this.remainingTries--;
            this.updateHangman();
        }

        this.updateDisplay();
        button.disabled = true;

        if (this.checkWin()) {
            alert('Congratulations! You won!');
        } else if (this.remainingTries === 0) {
            alert(`Game Over! The word was: ${this.currentWord}`);
        }
    }

    updateHangman() {
        const canvas = document.getElementById('hangman-canvas');
        const ctx = canvas.getContext('2d');
        const wrongGuesses = this.isHardMode ? 
            4 - this.remainingTries : 
            6 - this.remainingTries;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw all states up to current wrong guesses
        for (let i = 0; i <= wrongGuesses; i++) {
            if (this.hangmanStates[i]) {
                this.hangmanStates[i](ctx);
            }
        }
    }

    drawBase(ctx) {
        ctx.beginPath();
        ctx.moveTo(50, 140);
        ctx.lineTo(150, 140);
        ctx.moveTo(100, 140);
        ctx.lineTo(100, 20);
        ctx.lineTo(150, 20);
        ctx.lineTo(150, 30);
        ctx.stroke();
    }

    drawHead(ctx) {
        ctx.beginPath();
        ctx.arc(150, 40, 10, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawBody(ctx) {
        ctx.beginPath();
        ctx.moveTo(150, 50);
        ctx.lineTo(150, 90);
        ctx.stroke();
    }

    drawLeftArm(ctx) {
        ctx.beginPath();
        ctx.moveTo(150, 60);
        ctx.lineTo(130, 80);
        ctx.stroke();
    }

    drawRightArm(ctx) {
        ctx.beginPath();
        ctx.moveTo(150, 60);
        ctx.lineTo(170, 80);
        ctx.stroke();
    }

    drawLeftLeg(ctx) {
        ctx.beginPath();
        ctx.moveTo(150, 90);
        ctx.lineTo(130, 120);
        ctx.stroke();
    }

    drawRightLeg(ctx) {
        ctx.beginPath();
        ctx.moveTo(150, 90);
        ctx.lineTo(170, 120);
        ctx.stroke();
    }

    updateDisplay() {
        const wordDisplay = document.getElementById('word-display');
        wordDisplay.textContent = this.currentWord
            .split('')
            .map(letter => this.guessedLetters.has(letter) ? letter : '_')
            .join(' ');

        document.getElementById('guesses').textContent = 
            `Remaining tries: ${this.remainingTries}`;
        document.getElementById('hint').textContent = `Hint: ${this.currentHint}`;
    }

    checkWin() {
        return this.currentWord
            .split('')
            .every(letter => this.guessedLetters.has(letter));
    }
}

// Initialize the game when the page loads
window.onload = () => {
    new HangmanGame();
};
