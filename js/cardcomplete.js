document.addEventListener("DOMContentLoaded", () => {
	localStorage.removeItem("usedCards");
	localStorage.removeItem("selectedCardId");

	const goHomeBtn = document.getElementById("goHomeBtn");
	goHomeBtn.addEventListener("click", () => {
		window.location.href = "mainpage.html";
	});
});
