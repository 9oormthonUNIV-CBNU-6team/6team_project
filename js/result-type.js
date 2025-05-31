function goToAllResults() {
  window.location.href = "result-all.html";
}

function goToPractice() {
  const mainContent = document.getElementById("mainContent");
  const splash = document.getElementById("splash");

  mainContent.style.display = "none";
  splash.style.display = "flex";

  const logo = splash.querySelector(".logo");
  logo.style.width = "100.55px";
  logo.style.height = "79px";

  setTimeout(() => {
    window.location.href = "card.html";
  }, 2000);
}

function goHome() {
  window.location.href = "mainpage.html";
}
