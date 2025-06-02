import { loadSplash } from "./splash-loader.js";

// 모든 결과 보기 페이지로 이동
function goToAllResults() {
  window.location.href = "../result-all.html";
}

// 면접 연습 페이지로 이동
function goToPractice() {
  window.location.href = "../cardpick.html";
}

// 홈으로 이동
async function goHome() {
  // 메인 컨텐츠 숨기기
  document.getElementById("mainContent").style.display = "none";

  // splash 로드
  await loadSplash();

  // 2초 후 메인페이지로 이동
  setTimeout(() => {
    window.location.href = "../mainpage.html";
  }, 2000);
}

// 전역 함수로 등록
window.goToAllResults = goToAllResults;
window.goToPractice = goToPractice;
window.goHome = goHome;
