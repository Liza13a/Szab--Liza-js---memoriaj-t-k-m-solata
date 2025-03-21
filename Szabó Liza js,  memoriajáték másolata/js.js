let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let steps = 0;
    let cardCount = 16;  // Kezdőlap (4x4 = 16 kártya)
    let timerInterval;
    let seconds = 0;
    let minutes = 0;
    let isGameActive = false;  // Új változó a játék aktív státuszának kezelésére

const emojis = ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍍', '🥭', '🥥', '🍑', '🍈', '🍏',
    '🍅', '🥝', '🍆', '🌽', '🥒', '🥬', '🥦', '🫑', '🍠', '🥔', '🥕', '🌶️', '🍄', '🌰', '🍯', '🥜'];

    const gameBoard = document.getElementById('game-board');
    const restartButton = document.getElementById('restart-button');
    const gameMessage = document.getElementById('game-message');
    const stepCountDisplay = document.getElementById('step-count');
    const difficultySelect = document.getElementById('difficultySelect');
    const timerDisplay = document.getElementById('timer');
    
    function shuffleCards() {
        const selectedDifficulty = difficultySelect.value;
    
        if (selectedDifficulty === "2x2") {
            const selectedEmojis = [];
            while (selectedEmojis.length < 2) {
                const randomIndex = Math.floor(Math.random() * emojis.length);
                const emoji = emojis[randomIndex];
                if (!selectedEmojis.includes(emoji)) {
                    selectedEmojis.push(emoji);
                }
            }
    
            cards = [...selectedEmojis, ...selectedEmojis];
            cardCount = 4;
            gameBoard.style.gridTemplateColumns = `repeat(2, 60px)`;
            gameBoard.style.gridTemplateRows = `repeat(2, 60px)`;
        } else if (selectedDifficulty === "4x4") {
            cards = [...emojis.slice(0, 8), ...emojis.slice(0, 8)];
            cardCount = 16;
            gameBoard.style.gridTemplateColumns = `repeat(4, 60px)`;
            gameBoard.style.gridTemplateRows = `repeat(4, 60px)`;
        } else if (selectedDifficulty === "6x6") {
            cards = [...emojis.slice(0, 18), ...emojis.slice(0, 18)];
            cardCount = 36;
            gameBoard.style.gridTemplateColumns = `repeat(6, 60px)`;
            gameBoard.style.gridTemplateRows = `repeat(6, 60px)`;
        } else if (selectedDifficulty === "extreme") {
            cards = [...emojis.slice(0, 32), ...emojis.slice(0, 32)];
            cardCount = 64;
            gameBoard.style.gridTemplateColumns = `repeat(8, 60px)`;
            gameBoard.style.gridTemplateRows = `repeat(8, 60px)`;
        }
    
        // Fisher-Yates keverés
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Véletlenszerű index
            [cards[i], cards[j]] = [cards[j], cards[i]]; // Elemek cseréje
        }
}
    
function createCards() {
        shuffleCards();
        gameBoard.innerHTML = '';
        
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.addEventListener('click', () => flipCard(card));
            gameBoard.appendChild(card);
        });
    
        // Reset the matched pairs and message
        matchedPairs = 0;
        steps = 0;
        stepCountDisplay.textContent = steps;
        gameMessage.textContent = '';
        
        isGameActive = true; // Aktiváljuk a játékot
}
    
function flipCard(card) {
        if (!isGameActive || flippedCards.length >= 2 || card.classList.contains('flipped')) {
            return; // Ha a játék nem aktív vagy túl sok kártyát flipeltünk, ne csinálj semmit
        }
    
        card.classList.add('flipped');
        card.textContent = card.dataset.emoji;
        flippedCards.push(card);
        steps++;
        stepCountDisplay.textContent = steps;
    
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
    }
}
    
function checkMatch() {
        const [card1, card2] = flippedCards;
    
        if (card1.dataset.emoji === card2.dataset.emoji) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
    
            if (matchedPairs === cards.length / 2) {
                gameMessage.textContent = 'Gratulálok, megtaláltad az összes párt!';
                clearInterval(timerInterval);  // Stop the timer
                isGameActive = false;  // Játék befejezése
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
        }
    
        flippedCards = [];
}
    
function restartGame() {
        matchedPairs = 0;
        flippedCards = [];
        steps = 0;
        seconds = 0;
        minutes = 0;
        stepCountDisplay.textContent = steps;
        gameMessage.textContent = '';
        timerDisplay.textContent = "00:00";
        createCards();
    
        // Reset timer
        clearInterval(timerInterval);
        startTimer();
    
        isGameActive = true;  // Játék újraindítása
}
    
function startGame() {
        document.getElementById('settings-menu').style.display = 'none';
        document.getElementById('game-board-container').style.display = 'block';
        restartGame();
}
    
function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
            }
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
}
    
function goBack() {
    document.getElementById('settings-menu').style.display = 'block';
    document.getElementById('game-board-container').style.display = 'none';
    clearInterval(timerInterval);  // Stop the timer

    // Újrapozicionálás biztosítása
    const difficultyContainer = document.getElementById('difficulty-container');
    difficultyContainer.style.display = 'flex'; 
    isGameActive = false;  // Játék leállítása
}


        
    