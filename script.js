// --- 設定部分 ---
const cardImages = ['dino1.png', 'dino1.png', 'dino2.png', 'dino2.png', 'dino3.png', 'dino3.png', 'dino4.png', 'dino4.png']; // 使う画像のリスト
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// --- 音の準備 ---
const cardOpenSound = new Audio('sounds/cardopen.mp3');
const matchSound = new Audio('sounds/ok.mp3');

// iPad/Safari対策：先読みを強制
cardOpenSound.preload = 'auto';
matchSound.preload = 'auto';

// --- ゲームの初期化 ---
function initGame() {
    const gameContainer = document.querySelector('.game-container'); // HTMLのクラス名に合わせてね
    // カードをシャッフル
    cardImages.sort(() => Math.random() - 0.5);

    cardImages.forEach((img) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.info = img; // 判定用の名前を入れる
        
        // カードの内側（表と裏）
        card.innerHTML = `
            <div class="front-face" style="background-image: url('images/${img}')"></div>
            <div class="back-face"></div>
        `;
        
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    });
}

// --- カードをめくる処理 ---
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // ★ カードをめくる音を鳴らす
    cardOpenSound.currentTime = 0;
    cardOpenSound.play();

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // 1枚目のカード
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // 2枚目のカード
    secondCard = this;
    checkForMatch();
}

// --- 揃ったかどうかの判定 ---
function checkForMatch() {
    let isMatch = firstCard.dataset.info === secondCard.dataset.info;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// --- 揃った時の処理 ---
function disableCards() {
    // ★ 揃った時の音を鳴らす
    // めくる音と重ならないように一瞬遅らせるか、めくる音を止めると綺麗です
    cardOpenSound.pause(); 
    matchSound.currentTime = 0;
    matchSound.play();

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

// --- 外れた時の処理 ---
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

// --- 状態をリセット ---
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// ゲーム開始
initGame();