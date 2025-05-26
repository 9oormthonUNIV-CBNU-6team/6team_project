const cards = document.querySelectorAll('.card');

cards.forEach(card => {
	card.addEventListener('click', () => {
		card.classList.add('flipped');
		setTimeout(() => {
			window.location.href = 'card.html';
		}, 900);
	});
});