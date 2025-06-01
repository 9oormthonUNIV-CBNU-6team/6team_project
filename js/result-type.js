import { loadSplash } from "./splash-loader.js";

async function goToAllResults() {
  window.location.href = "result-all.html";
}

async function goToPractice() {
  const mainContent = document.getElementById("mainContent");
  mainContent.style.display = "none";

  await loadSplash();

  setTimeout(() => {
    window.location.href = "card.html";
  }, 2000);
}

async function goHome() {
  window.location.href = "mainpage.html";
}

// 전역 스코프에서 함수들을 사용할 수 있도록 export
window.goToAllResults = goToAllResults;
window.goToPractice = goToPractice;
window.goHome = goHome;
