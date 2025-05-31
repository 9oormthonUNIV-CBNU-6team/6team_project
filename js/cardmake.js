// 글자 수 표시
const bindCharCount = (id, countId) => {
	const el = document.getElementById(id);
	const count = document.getElementById(countId);
	el.addEventListener("input", () => {
		count.innerText = `${el.value.length}/30`;
	});
};

bindCharCount("question_content", "qc-count");
bindCharCount("company_name", "cn-count");
bindCharCount("job", "job-count");
bindCharCount("answer_content", "ans-count");

// 키워드 선택
const keywordEls = document.querySelectorAll('.keyword');
const keywordCounter = document.getElementById('keyword-count');

keywordEls.forEach(el => {
	el.addEventListener('click', () => {
		el.classList.toggle('selected');
		const selected = document.querySelectorAll('.keyword.selected');
		if (selected.length > 3) {
			el.classList.remove('selected');
			alert("상황 키워드는 최대 3개까지 선택할 수 있어요.");
		}
		keywordCounter.innerText = `${document.querySelectorAll('.keyword.selected').length}/3 선택됨`;
	});
});

// 전략 선택
const strategyEls = document.querySelectorAll('.strategy');
strategyEls.forEach(el => {
	el.addEventListener('click', () => {
		strategyEls.forEach(s => s.classList.remove('selected'));
		el.classList.add('selected');
	});
});

function submitData() {
	const question = document.getElementById('question_content').value.trim();
	const company = document.getElementById('company_name').value.trim();
	const job = document.getElementById('job').value.trim();
	const keywords = Array.from(document.querySelectorAll('.keyword.selected')).map(e => e.textContent);
	const strategy = document.querySelector('.strategy.selected')?.textContent || "";
	const answer = document.getElementById('answer_content').value.trim();

	if (!question || !company || !job || keywords.length !== 3 || !strategy || !answer) {
		alert("모든 항목을 올바르게 입력해 주세요.");
		return;
	}

	const payload = {
		question_content: question,
		category: keywords.join(", "),
		company_name: company,
		job: job,
		interviewinfo: strategy,
		answer_content: answer
	};

	fetch('/api/cards', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})
		.then(res => {
			if (!res.ok) throw new Error("fail");
			return res.json();
		})
		.then(data => {
			alert("등록 완료!");
			location.href = 'mainpage.html';
		})
		.catch(err => {
			alert("fail");
		});
}
