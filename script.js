let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// 音の準備
const cardOpenSound = new Audio('sounds/cardopen.mp3');
const matchSound = new Audio('sounds/ok.mp3');
cardOpenSound.preload = 'auto';
matchSound.preload = 'auto';

// 画像リスト（あなたの画像名に合わせて調整してください）
const cardImages = [
    'dino1.png', 'dino1.png', 
    'dino2.png', 'dino2.png', 
    'dino3.png', 'dino3.png', 
    'dino4.png', 'dino4.png'
];

// ★「ゲーム開始」ボタンを押した時に呼ばれる関数
function startGame() {
    // 盤面をリセット
    const gameContainer = document.getElementById('game-container') || document.querySelector('.game-container');
    if (!gameContainer) {
        alert("エラー：カードを入れる場所が見つかりません");
        return;
    }
    gameContainer.innerHTML = ''; // 前のカードを消す
    
    // iPad対策：最初のボタンクリックで音を許可
    cardOpenSound.play().then(() => {
        cardOpenSound.pause();
        cardOpenSound.currentTime = 0;
    }).catch(e => console.log("Audio prep waiting for interaction"));

    // シャッフルしてカードを作成
    const shuffled = [...cardImages].sort(() => Math.random() - 0.5);
    shuffled.forEach(img => {
        const card = createCard(img);
        gameContainer.appendChild(card);
    });
}

function createCard(img) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.info = img;
    card.innerHTML = `
        <div class="front-face" style="background-image: url('images/${img}')"></div>
        <div class="back-face"></div>
    `;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // めくる音
    cardOpenSound.currentTime = 0;
    cardOpenSound.play();

    this.classList.add('flip');

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
    // 揃った音
    matchSound.currentTime = 0;
    matchSound.play();

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}