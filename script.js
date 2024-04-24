
const cards = [
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
];
const gameBoard = document.getElementById('game-board');
let selectedCards = [];
        function createCard(CardUrl) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = CardUrl;
        
            const cardContent = document.createElement('img');
            cardContent.classList.add('card-content');
            cardContent.src = `${CardUrl}`;
            card.appendChild(cardContent);
            card.addEventListener('click', onCardClick);
            return card;
}

function duplicateArray(arraySimple){
    let arrayDouble = [];
    arrayDouble.push(...arraySimple);
    arrayDouble.push(...arraySimple);
    
    return arrayDouble;
}

function shuffleArray(arrayToshuffle){
    const arrayShuffled = arrayToshuffle.sort(() => 0.5 - Math.random());
    return arrayShuffled;
}

function onCardClick(e){
    const card = e.target.parentElement;
    card.classList.add('flip');

    selectedCards.push(card);
    if(selectedCards.length == 2){
        
        setTimeout(() => {
            if(selectedCards[0].dataset.value == selectedCards[1] .dataset.value){
                // on a trouvé une paire
                selectedCards[0].classList.add("matched");
                selectedCards[1].classList.add("matched");
                selectedCards[0].removeEventListener('click',onCardClick);
                selectedCards[1].removeEventListener('click',onCardClick);

                const allCardsNotMatched = document.querySelectorAll('.card:not(.matched)');
                if (allCardsNotMatched.lenght == 0){
                    // Le joueur à gagné
                    alert("Bravo, vous avez gagné");
                }
            }
            else{
                // on s'est trompé
                selectedCards[0].classList.remove("flip");
                selectedCards[1].classList.remove("flip");
            }
            selectedCards = [];
        },1000);
    }
}
let allCards = duplicateArray(cards);
// Mélanger le tableau
allCards = shuffleArray(allCards);

allCards.forEach (card => {
    const cardHtml = createCard(card);
    gameBoard.appendChild(cardHtml);
})