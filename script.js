let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchCount = 0;
let totalPairs = 0;

// 音の準備
const cardOpenSound = new Audio('sounds/cardopen.mp3');
const matchSound = new Audio('sounds/ok.mp3');
cardOpenSound.preload = 'auto';
matchSound.preload = 'auto';

// ★ここを修正しました！
const allImages = [
    'card1.png', 
    'card2.png', 
    'card3.png', 
    'card4.png', 
    'card5.png', 
    'card6.png'
];

function startGame() {
    const pairInput = document.getElementById('pair-count');
    totalPairs = parseInt(pairInput.value) || 4;

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    
    matchCount = 0;
    document.getElementById('match-count').innerText = matchCount;
    document.getElementById('matched-images-container').innerHTML = '';
    const board = document.getElementById('board');
    board.innerHTML = '';

    // 列数の調整
    board.style.gridTemplateColumns = totalPairs <= 3 ? `repeat(${totalPairs}, 140px)` : `repeat(3, 140px)`;

    // iPad音対策
    cardOpenSound.play().then(() => {
        cardOpenSound.pause();
        cardOpenSound.currentTime = 0;
    }).catch(() => {});

    let gameImages = [];
    for(let i = 0; i < totalPairs; i++) {
        gameImages.push(allImages[i], allImages[i]);
    }
    gameImages.sort(() => Math.random() - 0.5);

    gameImages.forEach(imgName => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.info = imgName;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front" style="background-image: url('images/${imgName}')"></div>
                <div class="card-back"></div>
            </div>
        `;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    cardOpenSound.currentTime = 0;
    cardOpenSound.play();
    this.classList.add('is-flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.info === secondCard.dataset.info;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    matchSound.currentTime = 0;
    matchSound.play();

    firstCard.classList.add('is-matched-anim');
    secondCard.classList.add('is-matched-anim');

    setTimeout(() => {
        const collection = document.getElementById('matched-images-container');
        const mini = document.createElement('div');
        mini.classList.add('matched-item');
        mini.style.backgroundImage = `url('images/${firstCard.dataset.info}')`;
        collection.appendChild(mini);

        firstCard.classList.add('is-matched');
        secondCard.classList.add('is-matched');

        matchCount++;
        document.getElementById('match-count').innerText = matchCount;

        resetBoard();

        if (matchCount === totalPairs) {
            setTimeout(() => {
                document.getElementById('result-screen').style.display = 'flex';
            }, 500);
        }
    }, 600);
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function showStartScreen() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}