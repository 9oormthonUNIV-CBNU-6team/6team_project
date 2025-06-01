const requiredFields = ['userId', 'password', 'nickname'];
const submitBtn = document.getElementById('submitBtn');

function checkRequiredFields() {
	const allFilled = requiredFields.every(name => {
		const value = document.querySelector(`input[name="${name}"]`).value.trim();
		return value.length > 0;
	});

	submitBtn.disabled = !allFilled;
}

// X 버튼 눌렀을 때 login.html 이동
document.querySelector('.close-button').addEventListener('click', function () {
	window.location.href = 'index.html';
});

// 실시간 입력 감지
requiredFields.forEach(name => {
	const input = document.querySelector(`input[name="${name}"]`);
	input.addEventListener('input', checkRequiredFields);
});

// 회원가입 폼 제출

document.getElementById('signupForm').addEventListener('submit', async function (e) {
	e.preventDefault();
	document.querySelectorAll('input').forEach(input => input.classList.remove('error'));
	document.querySelectorAll('.error-message').forEach(div => div.textContent = '');

	const formData = new FormData(this);
	const data = {};
	formData.forEach((value, key) => data[key] = value);
	console.log("보내는 데이터:", data);

	try {
		const res = await fetch('https://upbeat.io.kr/api/users/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		const result = await res.json();

		if (!res.ok) {
			if (result.errors) {
				result.errors.forEach(error => {
					const field = error.field;
					const reason = error.reason;
					const input = document.querySelector(`input[name="${field}"]`);
					const msgDiv = document.getElementById(`error-${field}`);

					if (input && msgDiv) {
						input.classList.add('error');
						msgDiv.textContent = reason;
					}
				});
			} else {
				alert(result.message || '오류 발생');
			}
		} else {
			localStorage.setItem("userId", result.userId);
			localStorage.setItem("nickname", result.nickname);
			localStorage.setItem("token", result.token);
			window.location.href = 'welcome.html';
		}
	} catch (err) {
		console.error(err);
		alert('서버와 통신 중 오류 발생');
	}
});
