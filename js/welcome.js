const nickname = localStorage.getItem("nickname") || "사용자";
document.getElementById("nickname").textContent = nickname;

function goToLogin() {
	window.location.href = "index.html";
}
