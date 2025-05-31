document.addEventListener("DOMContentLoaded", async () => {
	const cardGrid = document.getElementById("cardGrid");
	const usedCards = JSON.parse(localStorage.getItem("usedCards") || "[]").map(Number);
	const token = localStorage.getItem("token");

	if (!token) {
		alert("로그인이 필요합니다.");
		window.location.href = "login.html";
		return;
	}

	// ✅ 6장 모두 열람한 경우 바로 cardcomplete.html로 이동
	if (usedCards.length >= 6) {
		window.location.href = "cardcomplete.html";
		return;
	}

	try {
		const response = await fetch("http://52.78.187.191:8080/api/cards/cardinfo", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		});

		if (!response.ok) throw new Error("API 호출 실패");

		const data = await response.json();
		const cardIds = data.cardId;

		if (!Array.isArray(cardIds)) throw new Error("cardId는 배열이 아닙니다.");

		cardIds.forEach((cardId) => {
			const card = document.createElement("div");
			card.classList.add("card");
			if (usedCards.includes(cardId)) {
				card.classList.add("flipped");
				card.style.pointerEvents = "none";
			}

			const cardInner = document.createElement("div");
			cardInner.classList.add("card-inner");

			const front = document.createElement("div");
			front.classList.add("card-front");

			const back = document.createElement("div");
			back.classList.add("card-back");

			cardInner.appendChild(front);
			cardInner.appendChild(back);
			card.appendChild(cardInner);
			cardGrid.appendChild(card);

			if (!usedCards.includes(cardId)) {
				card.addEventListener("click", () => {
					card.classList.add("flipped");

					localStorage.setItem("selectedCardId", cardId);
					const updatedUsed = [...new Set([...usedCards, cardId])];
					localStorage.setItem("usedCards", JSON.stringify(updatedUsed));

					setTimeout(() => {
						window.location.href = "card.html";
					}, 900);
				});
			}
		});
	} catch (error) {
		console.error("카드 불러오기 실패:", error);
		alert("카드 정보를 불러오지 못했습니다. 로그인 상태를 확인해주세요.");
	}
});
