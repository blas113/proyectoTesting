document.addEventListener("DOMContentLoaded", () => {
    const cardForm = document.getElementById("card-form");
    const cardInput = document.getElementById("card-input");
    const cardContainer = document.getElementById("card-container");

 
    const loadCards = () => {
        const cards = JSON.parse(localStorage.getItem("cards")) || [];
        cardContainer.innerHTML = "";
        cards.forEach((cardContent, index) => {
            createCardElement(cardContent, index);
        });
    };

  
    const saveCards = (cards) => {
        localStorage.setItem("cards", JSON.stringify(cards));
    };

  
    const createCardElement = (content, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.textContent = content;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.addEventListener("click", () => {
            deleteCard(index);
        });

        card.appendChild(deleteButton);
        cardContainer.appendChild(card);
    };

   
    cardForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = cardInput.value.trim();
        if (content) {
            const cards = JSON.parse(localStorage.getItem("cards")) || [];
            cards.push(content);
            saveCards(cards);
            createCardElement(content, cards.length - 1);
            cardInput.value = "";
        }
    });

   
    const deleteCard = (index) => {
        const cards = JSON.parse(localStorage.getItem("cards")) || [];
        cards.splice(index, 1);
        saveCards(cards);
        loadCards();
    };

   
    loadCards();
});