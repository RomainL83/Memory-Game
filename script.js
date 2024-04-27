const disneyCards = [
    'img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg',
    'img/5.jpg', 'img/6.jpg', 'img/7.jpg', 'img/8.jpg',
];

const animalCards = [
    'img/animals/a.jpg', 'img/animals/b.jpg', 'img/animals/c.jpg', 'img/animals/d.jpg',
    'img/animals/e.jpg', 'img/animals/f.jpg', 'img/animals/g.jpg', 'img/animals/h.jpg',
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

function duplicateArray(arraySimple) {
    return [...arraySimple, ...arraySimple];
}

function shuffleArray(arrayToShuffle) {
    return arrayToShuffle.sort(() => Math.random() - 0.5);
}

function onCardClick(e) {
    const card = e.target.parentElement;
    card.classList.add('flip');
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        setTimeout(() => {
            if (selectedCards[0].dataset.value === selectedCards[1].dataset.value) {
                selectedCards.forEach((card) => {
                    card.classList.add('matched');
                    card.removeEventListener('click', onCardClick);
                });

                if (document.querySelectorAll('.card:not(.matched)').length === 0) {
                    alert('Bravo, vous avez gagné');
                }
            } else {
                selectedCards.forEach((card) => {
                    card.classList.remove('flip');
                });
            }
            selectedCards = [];
        }, 1000);
    }
}

function initGame(selectedCardImages = disneyCards) {
    gameBoard.innerHTML = '';
    let allCards = duplicateArray(selectedCardImages);
    allCards = shuffleArray(allCards);
    allCards.forEach((cardUrl) => {
        const cardElement = createCard(cardUrl);
        gameBoard.appendChild(cardElement);
    });
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Met à jour l'UI après la connexion
function updateLoginUI(username) {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userPanel = document.getElementById('userPanel');
    const loginButton = document.getElementById('loginButton');
    const purchaseOptions = document.getElementById('purchaseOptions');
    showCardSets();

    if (username) {
        welcomeMessage.innerText = `Bienvenue, ${username}!`;
        userPanel.style.display = 'block';
        loginButton.style.display = 'none';
        purchaseOptions.style.display = 'block'; // Affiche les options d'achat
    } else {
        welcomeMessage.innerText = '';
        userPanel.style.display = 'none';
        loginButton.style.display = 'block';
        purchaseOptions.style.display = 'none'; // Cache les options d'achat
        initGame(); // Réinitialiser le jeu avec le jeu de cartes par défaut
    }
}

function loginUser(username) {
    localStorage.setItem('username', username); // Enregistrez le nom d'utilisateur dans localStorage
    updateLoginUI(username); // Mettez à jour l'interface utilisateur
    hideLoginModal(); // Cachez la fenêtre de connexion
    initGame(); // Réinitialisez ou initialisez le jeu
}

function logoutUser() {
    localStorage.removeItem('username');
    localStorage.removeItem('unlockedAnimals'); // En supposant que vous souhaitez réinitialiser cela également
    updateLoginUI(null);
    initGame(); // Réinitialiser le jeu après la déconnexion
}

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    loginUser(username);
});

function showCardSets() {
    const cardSetsContainer = document.getElementById('cardSets');
    const cardSetOptionsContainer = document.getElementById('cardSetOptions');
    cardSetOptionsContainer.innerHTML = '';

    // Créez toujours l'option Disney
    const setDivDisney = document.createElement('div');
    setDivDisney.classList.add('cardSetOption');
    setDivDisney.textContent = 'Disney';
    setDivDisney.onclick = () => selectCardSet(disneyCards);
    cardSetOptionsContainer.appendChild(setDivDisney);

    // Ajoutez l'option Animaux seulement si elle a été achetée
    const hasUnlockedAnimals = localStorage.getItem('unlockedAnimals') === 'true';
    if (hasUnlockedAnimals) {
        const setDivAnimals = document.createElement('div');
        setDivAnimals.classList.add('cardSetOption');
        setDivAnimals.textContent = 'Animaux';
        setDivAnimals.onclick = () => selectCardSet(animalCards);
        cardSetOptionsContainer.appendChild(setDivAnimals);
    } else {
        // Si les animaux ne sont pas encore déverrouillés, assurez-vous que la section d'achat est visible
        document.getElementById('purchaseOptions').style.display = 'block';
    }

    cardSetsContainer.style.display = 'block';
}


function selectCardSet(cardImages) {
    localStorage.setItem('selectedCardSet', JSON.stringify(cardImages));
    resetGame(cardImages);
}

function resetGame(cardImages) {
    gameBoard.innerHTML = '';
    initGame(cardImages);
}

// Fonction pour simuler l'achat du jeu de cartes 'Animaux'
function buyAnimalCards() {
    localStorage.setItem('unlockedAnimals', 'true'); // Sauvegarde que l'utilisateur a acheté le jeu de cartes Animaux
    // Affichez le modal de paiement au lieu d'effectuer directement l'achat
    document.getElementById('paymentModal').style.display = 'block';
    alert("Vous avez acheté le jeu de cartes Animaux !");
    showCardSets(); // Mettre à jour l'affichage des jeux de cartes
}
// Attache les événements après que le DOM est entièrement chargé
window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('loginButton').addEventListener('click', showLoginModal);
    document.querySelector('.close').addEventListener('click', hideLoginModal);
    document.getElementById('logoutButton').addEventListener('click', logoutUser);
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        loginUser(username);
    });
    document.getElementById('buyAnimalsButton').addEventListener('click', function() {
        document.getElementById('paymentModal').style.display = 'block'; // Affiche le modal de paiement
    });

    // Ajout du gestionnaire de soumission du formulaire de paiement fictif
    document.getElementById('fakePaymentForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche l'envoi réel du formulaire
        confirmPayment(); // Simule la confirmation de paiement
    });

    // Fermer le modal de paiement si l'utilisateur clique sur la croix
    document.getElementById('closePaymentModal').addEventListener('click', function() {
        document.getElementById('paymentModal').style.display = 'none';
    });

    // Fermer le modal en cliquant en dehors de celui-ci
    window.onclick = function(event) {
        if (event.target == document.getElementById('loginModal')) {
            document.getElementById('loginModal').style.display = "none";
        }
        if (event.target == document.getElementById('paymentModal')) {
            document.getElementById('paymentModal').style.display = "none";
        }
    };

    // Vérifie si l'utilisateur est déjà connecté et met à jour l'interface utilisateur en conséquence
    const storedUsername = localStorage.getItem('username');
    updateLoginUI(storedUsername);
});

// Fonction appelée lorsque l'utilisateur "confirme" le paiement
function confirmPayment() {
    localStorage.setItem('unlockedAnimals', 'true'); // Marquez le jeu de cartes Animaux comme acheté
    alert("Paiement réussi. Vous avez maintenant accès au jeu de cartes Animaux !");
    document.getElementById('paymentModal').style.display = 'none'; // Fermez le modal de paiement
    showCardSets(); // Mettez à jour l'affichage des jeux de cartes
}

// Attachez l'écouteur d'événements au bouton de confirmation de paiement
document.getElementById('confirmPaymentButton').addEventListener('click', confirmPayment);

// Fonction pour fermer le modal de paiement si l'utilisateur clique sur la croix
document.getElementById('closePaymentModal').addEventListener('click', function() {
    document.getElementById('paymentModal').style.display = 'none';
});
window.onclick = function(event) {
    if (event.target == document.getElementById('loginModal')) {
        document.getElementById('loginModal').style.display = "none";
    }
    if (event.target == document.getElementById('paymentModal')) {
        document.getElementById('paymentModal').style.display = "none";
    }
}