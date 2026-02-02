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

// 画像リスト（最大6ペア分）
const allImages = ['dino1.png', 'dino2.png', 'dino3.png', 'dino4.png', 'dino5.png', 'dino6.png'];

function startGame() {
    const pairInput = document.getElementById('pair-count');
    totalPairs = parseInt(pairInput.value);
    
    // 入力チェック（1〜6に制限）
    if (totalPairs < 1) totalPairs = 1;
    if (totalPairs > 6) totalPairs = 6;

    // 画面の切り替え
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    
    // リセット
    matchCount = 0;
    document.getElementById('match-count').innerText = matchCount;
    document.getElementById('matched-images-container').innerHTML = '';
    const board = document.getElementById('board');
    board.innerHTML = '';

    // iPadの音対策
    cardOpenSound.play().then(() => {
        cardOpenSound.pause();
        cardOpenSound.currentTime = 0;
    }).catch(() => {});

    // 使う分の画像を選んでペアを作る
    let gameImages = [];
    for(let i = 0; i < totalPairs; i++) {
        gameImages.push(allImages[i], allImages[i]);
    }

    // シャッフル
    gameImages.sort(() => Math.random() - 0.5);

    // カード作成
    gameImages.forEach(imgName => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.info = imgName;
        card.innerHTML = `
            <div class="front-face" style="background-image: url('images/${imgName}')"></div>
            <div class="back-face"></div>
        `;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

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

    // コレクションに追加
    const collection = document.getElementById('matched-images-container');
    const miniImg = document.createElement('img');
    miniImg.src = `images/${firstCard.dataset.info}`;
    miniImg.style.width = "50px";
    collection.appendChild(miniImg);

    matchCount++;
    document.getElementById('match-count').innerText = matchCount;

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();

    // クリア判定
    if (matchCount === totalPairs) {
        setTimeout(() => {
            document.getElementById('result-screen').style.display = 'flex';
        }, 500);
    }
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

function showStartScreen() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}