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

// 画像リスト
const allImages = ['dino1.png', 'dino2.png', 'dino3.png', 'dino4.png', 'dino5.png', 'dino6.png'];

function startGame() {
    const pairInput = document.getElementById('pair-count');
    totalPairs = parseInt(pairInput.value) || 4;

    // 画面切り替え
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    
    // リセット
    matchCount = 0;
    document.getElementById('match-count').innerText = matchCount;
    document.getElementById('matched-images-container').innerHTML = '';
    const board = document.getElementById('board');
    board.innerHTML = '';

    // カードの並び（列数）をペア数に応じて調整
    if (totalPairs <= 3) {
        board.style.gridTemplateColumns = `repeat(${totalPairs}, 160px)`;
    } else {
        board.style.gridTemplateColumns = `repeat(3, 160px)`;
    }

    // iPad音対策
    cardOpenSound.play().then(() => { cardOpenSound.pause(); }).catch(() => {});

    // ペア作成
    let gameImages = [];
    for(let i = 0; i < totalPairs; i++) {
        gameImages.push(allImages[i], allImages[i]);
    }
    gameImages.sort(() => Math.random() - 0.5);

    // カード作成（CSSのクラス名 .card-inner / .card-back / .card-front に合わせています）
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

    // CSSに合わせて .is-flipped を使う
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

    // 揃った時のエフェクトクラスを追加
    firstCard.classList.add('is-matched-anim');
    secondCard.classList.add('is-matched-anim');

    setTimeout(() => {
        // コレクションエリアに追加
        const collection = document.getElementById('matched-images-container');
        const mini = document.createElement('div');
        mini.classList.add('matched-item');
        mini.style.backgroundImage = `url('images/${firstCard.dataset.info}')`;
        collection.appendChild(mini);

        // カードを消す（CSSの .is-matched に合わせる）
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