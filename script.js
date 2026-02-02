let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let totalPairs = 0;

function startGame() {
    totalPairs = parseInt(document.getElementById('pair-count').value);
    if (totalPairs < 1 || totalPairs > 6) return;

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    
    const board = document.getElementById('board');
    board.innerHTML = '';
    document.getElementById('matched-images-container').innerHTML = '';
    matches = 0;
    updateScore();

    // 4枚なら2列、それ以上は3〜4列
    if (totalPairs <= 2) {
        board.style.gridTemplateColumns = "repeat(2, 1fr)";
    } else if (totalPairs <= 4) {
        board.style.gridTemplateColumns = "repeat(3, 1fr)";
    } else {
        board.style.gridTemplateColumns = "repeat(4, 1fr)";
    }

    let deck = [];
    for (let i = 1; i <= totalPairs; i++) { deck.push(i, i); }
    deck.sort(() => Math.random() - 0.5);

    deck.forEach(num => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.num = num;
        card.innerHTML = `<div class="card-inner"><div class="card-back"></div><div class="card-front" style="background-image: url('images/card${num}.png');"></div></div>`;
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (lockBoard || card === firstCard || card.classList.contains('is-matched')) return;
    card.classList.add('is-flipped');
    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkMatch();
    }
}

function checkMatch() {
    if (firstCard.dataset.num === secondCard.dataset.num) {
        lockBoard = true;
        firstCard.classList.add('is-matched-anim');
        secondCard.classList.add('is-matched-anim');

        setTimeout(() => {
            const num = firstCard.dataset.num;
            firstCard.classList.add('is-matched');
            secondCard.classList.add('is-matched');
            
            addToCollection(num);
            matches++;
            updateScore();

            if (matches === totalPairs) {
                // クリア画面を表示
                document.getElementById('result-screen').style.display = 'flex';
            }
            resetBoard();
        }, 1000);
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('is-flipped');
            secondCard.classList.remove('is-flipped');
            resetBoard();
        }, 800);
    }
}

function addToCollection(num) {
    const container = document.getElementById('matched-images-container');
    const img = document.createElement('div');
    img.classList.add('matched-item');
    img.style.backgroundImage = `url('images/card${num}.png')`;
    container.appendChild(img);
}

function updateScore() {
    document.getElementById('match-count').innerText = matches;
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function showStartScreen() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}