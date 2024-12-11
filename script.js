document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const confettiContainer = document.getElementById('confetti-container');
    const playAgainBtn = document.getElementById('play-again');
    const timerElement = document.getElementById('timer');
    const congratulationsElement = document.getElementById('congratulations');
    playAgainBtn.addEventListener('click', resetGame);

    let hasFlippedCard = false;
    let firstCard, secondCard;
    let lockBoard = false;
    let matchesFound = 0;
    const totalPairs = 8;

    let timerInterval;
    let secondsElapsed = 0;
    let timerStarted = false;

    // Start the timer
    function startTimer() {
        secondsElapsed = 0;
        timerElement.textContent = formatTime(secondsElapsed);
        timerInterval = setInterval(() => {
            secondsElapsed++;
            timerElement.textContent = formatTime(secondsElapsed);
        }, 1000);
    }

    // Stop the timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Format time as mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    }

    // Shuffle cards at the start
    function shuffle() {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 16);
            card.style.order = randomPos;
        });
    }
    shuffle();

    // Add an event listener to each card
    cards.forEach(card => {
        card.addEventListener('click', flipCard);
    });

    function flipCard() {
        if (!timerStarted) {
            timerStarted = true;
            startTimer(); // Start the timer when the first card is clicked
        }

        if (lockBoard || this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
        } else {
            secondCard = this;
            checkForMatch();
        }
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.image === secondCard.dataset.image;
        isMatch ? disableCards() : unflipCards();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 400);
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchesFound++;

        if (matchesFound === totalPairs) {
            stopTimer();
            showConfetti();
        }

        resetBoard();
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function startConfetti() {
        function createConfettiPiece() {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');

            const sizeClass = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)];
            confetti.classList.add(sizeClass);

            if (Math.random() > 0.5) {
                confetti.classList.add('circle');
            }

            const confettiColors = ['#FFC107', '#2196F3', '#FF5722', '#4CAF50', '#E91E63'];
            confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;

            confettiContainer.appendChild(confetti);

            confetti.addEventListener('animationend', () => confetti.remove());
        }

        for (let i = 0; i < 1000; i++) {
            createConfettiPiece();
        }
    }

    function showConfetti() {
        startConfetti();
        playAgainBtn.style.display = 'block';
        congratulationsElement.style.display = 'block';
    }

    // Reset the game
    function resetGame() {
        stopTimer();
        timerStarted = false;
        matchesFound = 0;
        cards.forEach(card => card.classList.remove('flipped', 'matched'));
        congratulationsElement.style.display = 'none';
        playAgainBtn.style.display = 'none';
        shuffle();
    }
});
