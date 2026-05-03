import { useState, useEffect } from "react";

export default function SavedCards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cards")) || [];
    setCards(saved);
  }, []);

  const deleteCard = (index) => {
    const updated = cards.filter((_, i) => i !== index);
    setCards(updated);
    localStorage.setItem("cards", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Saved Cards</h2>

      {cards.length === 0 ? (
        <p>No cards saved</p>
      ) : (
        cards.map((card, index) => (
          <div key={index}>
            <p>**** **** {card.number.slice(-8)}</p>

            <button onClick={() => deleteCard(index)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}