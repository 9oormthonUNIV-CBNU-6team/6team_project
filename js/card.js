const cardId = localStorage.getItem("selectedCardId");
const token = localStorage.getItem("token");

if (!cardId || !token) {
  alert("로그인이 필요하거나 카드가 선택되지 않았습니다.");
  location.href = "index.html";
}

const STRATEGY_LIST = [
  "공손하게 회피",
  "정면 돌파",
  "유머 활용",
  "질문 재확인 후 답변"
];

async function fetchCardData() {
  try {
    const res = await fetch(`https://upbeat.io.kr/api/cards/${cardId}/show`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("API 요청 실패");

    const data = await res.json();

    // 질문 및 메타정보 표시
    document.getElementById("question").innerText = data.questionContent;
    document.getElementById("company").innerText = data.companyName;
    document.getElementById("position").innerText = data.job;
    document.getElementById("keywords").innerHTML = data.status.map(k => `<span>${k}</span>`).join('');
	document.getElementById("commentList").classList.add("hidden");

    // 전략 버튼들 고정 렌더링
    renderStrategyButtons();

    // 모달 정보 표시
    document.getElementById("modalQuestion").innerText = data.questionContent;
    document.getElementById("modalCompany").innerText = data.companyName;
    document.getElementById("modalPosition").innerText = data.job;
    document.getElementById("modalKeywords").innerHTML = data.status.map(k => `<span class="tag">${k}</span>`).join('');
    document.getElementById("modalStrategy").innerHTML = `<span class="tag">${data.strategy}</span>`;
    document.getElementById("modalAnswer").innerText = data.answerContent;

    renderAnswers(data.answers);
  } catch (err) {
    console.error("카드 불러오기 실패:", err);
    alert("카드 정보를 불러오지 못했습니다.");
  }
}

function renderStrategyButtons() {
  const options = document.getElementById("options");
  options.innerHTML = "";

  const raw = STRATEGY_LIST.length;
  const percents = Array(raw).fill(0).map(() => Math.floor(Math.random() * 25 + 10));
  const total = percents.reduce((a, b) => a + b, 0);
  const scaled = percents.map(p => Math.round((p / total) * 100));
  const adjusted = scaled.map((p, i) =>
    i === raw - 1 ? 100 - scaled.slice(0, -1).reduce((a, b) => a + b, 0) : p
  );

  STRATEGY_LIST.forEach((strategy, index) => {
    const percent = adjusted[index];
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.innerHTML = `
      <div class="bar" style="width: 0%"></div>
      <span>${strategy}</span>
      <span class="percent">${percent}%</span>
    `;

    btn.onclick = async () => {
      await handleStrategySelect(strategy, btn);

      options.classList.add("show-percent");
      document.querySelectorAll('.option-list button').forEach((b, i) => {
        b.querySelector('.bar').style.width = `${adjusted[i]}%`;
        b.classList.add(b === btn ? 'selected' : 'unselected');
        b.disabled = true;
      });
      document.getElementById("commentSection").classList.remove("hidden");
    };

    options.appendChild(btn);
  });
}

async function handleStrategySelect(strategyText, buttonEl) {
  try {
    const res = await fetch(`https://upbeat.io.kr/api/cards/${cardId}/strategy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ strategy: strategyText, cardId: parseInt(cardId) })
    });
    const result = await res.json();
    alert(result.message);
  } catch (err) {
    alert("전략 등록 실패");
  }
}

function renderAnswers(answers) {
  const list = document.getElementById("commentList");

  if (!answers || answers.length === 0) {
    list.classList.add("hidden");
    return;
  }

  list.classList.remove("hidden");
  list.innerHTML = "";

  answers.forEach(answer => {
    const card = document.createElement("div");
    card.className = "answer-card";
    card.innerHTML = `
      <div class="answer-header">
        <span><strong>${answer.userNickname}</strong></span>
        <span>${formatDate(answer.createdAt)}</span>
      </div>
      <div class="answer-content">${answer.content}</div>
      <div class="answer-footer">
        <button class="like-btn" data-liked="false" onclick="toggleLike(${answer.answerId}, this)">
          <img src="assets/images/like-before.png" alt="like">
          <span>${answer.likes}</span>
        </button>
      </div>
    `;
    list.appendChild(card);
  });
}

document.getElementById("submitBtn").addEventListener("click", async () => {
  const content = document.getElementById("userComment").value.trim();
  if (!content) return alert("내용을 입력해주세요.");

  try {
    const res = await fetch(`https://upbeat.io.kr/api/cards/${cardId}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content, cardId: parseInt(cardId) })
    });
    const result = await res.json();
    alert(result.message);
    document.getElementById("userComment").value = "";
    updateCharCount();
    fetchCardData();
  } catch (err) {
    alert("답변 등록 실패");
  }
});

async function toggleLike(answerId, btnEl) {
  const liked = btnEl.getAttribute("data-liked") === "true";
  const url = liked
    ? `https://upbeat.io.kr/api/cards/${cardId}/likeCancel/${answerId}`
    : `https://upbeat.io.kr/api/cards/${cardId}/like`;
  const method = liked ? "DELETE" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: liked ? null : JSON.stringify({ answerId })
    });

    const result = await res.json();
    btnEl.querySelector("span").innerText = result.likes;
    btnEl.setAttribute("data-liked", (!liked).toString());
    btnEl.querySelector("img").src = !liked ? "assets/images/like-after.png" : "assets/images/like-before.png";
  } catch (err) {
    alert("좋아요 처리 실패");
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${String(d.getFullYear()).slice(2)}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
}

function updateCharCount() {
  const textarea = document.getElementById("userComment");
  const count = textarea.value.length;
  document.getElementById("charCount").innerText = `${count}/30`;
}

function toggleModal() {
  document.getElementById('modalOverlay').classList.toggle('active');
  document.getElementById('cardModal').classList.toggle('active');
}

fetchCardData();
