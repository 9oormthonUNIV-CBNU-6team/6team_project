import { removeToken, getToken } from "./api/config.js";

document.addEventListener("DOMContentLoaded", () => {
	// JWT 토큰 콘솔 출력
	const token = getToken();
	console.log("현재 JWT 토큰:", token);

	// 로그아웃 버튼
	const logoutButton = document.querySelector(".logout-button");
	logoutButton.addEventListener("click", showLogoutPopup);

	// 카드 클릭 이벤트
	document.getElementById("testCard").addEventListener("click", () => {
		window.location.href = "test.html";
	});

	document.getElementById("gameCard").addEventListener("click", () => {
		window.location.href = "cardpick.html";
	});

	// 팝업 관련 요소들
	const popup = document.getElementById("logoutPopup");
	const cancelBtn = document.getElementById("cancelLogout");
	const confirmBtn = document.getElementById("confirmLogout");

	// 팝업 표시
	function showLogoutPopup() {
		popup.style.display = "flex";
	}

	// 팝업 닫기
	function closePopup() {
		popup.style.display = "none";
	}

	// 로그아웃 처리
	function confirmLogout() {
		removeToken();
		localStorage.clear();
		window.location.href = "login.html";
	}

	// 이벤트 리스너 등록
	cancelBtn.addEventListener("click", closePopup);
	confirmBtn.addEventListener("click", confirmLogout);
});

function goToLogin() {
	window.location.href = "login.html";
}