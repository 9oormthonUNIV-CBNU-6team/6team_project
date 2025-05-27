// 더미 데이터 - API 연동 시 교체
const cardData = {
	question: "동기들 중 본인이 가장 낫다고 생각하는 점은 무엇인가요?",
	company: "카카오",
	position: "글로벌마케팅",
	keywords: ["자유로운", "다대일", "긍정적"],
	strategy: "공손하게 회피",
	answer: "동기마다 강점이 달라 조심스럽습니다. 저는 성장하는 자세가 강점입니다.",
	options: [
		{ text: "공손하게 회피", percent: 21 },
		{ text: "정면 돌파", percent: 55 },
		{ text: "유머 활용", percent: 8 },
		{ text: "질문 재확인 후 답변", percent: 16 },
	]
};

window.onload = () => {
	document.getElementById('question').innerText = cardData.question;
	document.getElementById('company').innerText = cardData.company;
	document.getElementById('position').innerText = cardData.position;

	document.getElementById('keywords').innerHTML =
		cardData.keywords.map(k => `<span>${k}</span>`).join('');

	const optionList = document.getElementById('options');
	cardData.options.forEach(opt => {
		const btn = document.createElement('button');
		btn.innerText = opt.text;
		btn.onclick = () => {
			document.querySelectorAll('.option-list button').forEach(b => {
				b.classList.add('selected');
				b.innerHTML += `<span class="percent">${opt.percent}%</span>`;
				b.disabled = true;
			});
			document.getElementById('commentSection').classList.remove('hidden');
		};
		optionList.appendChild(btn);
	});

	// 모달용 데이터
	document.getElementById('modalQuestion').innerText = cardData.question;
	document.getElementById('modalCompany').innerText = cardData.company;
	document.getElementById('modalPosition').innerText = cardData.position;
	document.getElementById('modalKeywords').innerHTML = cardData.keywords.map(k => `<span>${k}</span>`).join('');
	document.getElementById('modalStrategy').innerText = cardData.strategy;
	document.getElementById('modalAnswer').innerText = cardData.answer;
};

function toggleModal() {
	document.getElementById('modalOverlay').classList.toggle('active');
	document.getElementById('cardModal').classList.toggle('active');
}

function updateCharCount() {
	const textarea = document.getElementById('userComment');
	const count = textarea.value.length;
	document.getElementById('charCount').innerText = `${count}/30`;
}
