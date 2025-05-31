// 기본값 준비
const cardId = localStorage.getItem("selectedCardId");
const token = localStorage.getItem("token");

if (!cardId || !token) {
  alert("로그인이 필요하거나 카드가 선택되지 않았습니다.");
  location.href = "login.html";
}

// 카드 불러오기
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

    // 전략 버튼들 렌더링 (기본 전략 포함)
    const options = document.getElementById("options");
    options.innerHTML = "";

    let strategies = data.strategies;
    if (!strategies || strategies.length === 0) {
      strategies = [
        { strategy: "공손하게 회피", userNickname: "기본 전략" },
        { strategy: "정면 돌파", userNickname: "기본 전략" },
        { strategy: "유머 활용", userNickname: "기본 전략" },
        { strategy: "질문 재확인 후 답변", userNickname: "기본 전략" },
      ];
    }

    // 임의 percent 생성
    const raw = strategies.length;
    const percents = Array(raw).fill(0).map(() => Math.floor(Math.random() * 25 + 10));
    const total = percents.reduce((a, b) => a + b, 0);
    const scaled = percents.map(p => Math.round((p / total) * 100));
    const adjusted = scaled.map((p, i) => i === raw - 1 ? 100 - scaled.slice(0, -1).reduce((a, b) => a + b, 0) : p);

    strategies.forEach((strategy, index) => {
      const percent = adjusted[index];
      const btn = document.createElement("button");
      btn.className = "option-button";
      btn.innerHTML = `
        <div class="bar" style="width: 0%"></div>
        <span>${strategy.userNickname}: ${strategy.strategy}</span>
        <span class="percent">${percent}%</span>
      `;

      btn.onclick = async () => {
        await handleStrategySelect(strategy.strategy, btn);

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

// 전략 선택 처리
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

// 답변 렌더링
function renderAnswers(answers) {
  const list = document.getElementById("commentList");
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

// 답변 등록
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

// 좋아요 토글
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

// 날짜 포맷
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${String(d.getFullYear()).slice(2)}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
}

// 글자 수 표시
function updateCharCount() {
  const textarea = document.getElementById("userComment");
  const count = textarea.value.length;
  document.getElementById("charCount").innerText = `${count}/30`;
}

// 모달 토글
function toggleModal() {
  document.getElementById('modalOverlay').classList.toggle('active');
  document.getElementById('cardModal').classList.toggle('active');
}

// 최초 실행
fetchCardData();
