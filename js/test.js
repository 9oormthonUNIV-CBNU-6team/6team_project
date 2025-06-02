const BASE_URL = "https://upbeat.io.kr";


let currentQuestionIndex = 0;
let questions = [];
let token = localStorage.getItem("token");
const TOTAL_QUESTIONS = 10;

// 토큰 유효성 검사
function validateToken() {
  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// 질문 목록 가져오기
async function fetchQuestions() {
  if (!validateToken()) return;

  try {
    const response = await fetch(`${BASE_URL}/api/questions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 403) {
      // 이미 답변했거나 권한이 없는 경우
      await checkAndRedirectToResult();
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allQuestions = await response.json();
    questions = allQuestions.slice(0, TOTAL_QUESTIONS);
    displayQuestion();
  } catch (error) {
    console.error("질문을 가져오는데 실패했습니다:", error);
    await checkAndRedirectToResult();
  }
}

// 이미 답변한 경우 결과 페이지로 리다이렉트
async function checkAndRedirectToResult() {
  if (!validateToken()) return;

  try {
    const userId = getUserIdFromToken(token);
    if (!userId) {
      throw new Error("유효하지 않은 토큰입니다.");
    }

    const response = await fetch(
      `${BASE_URL}/api/user-answers/result/redirect/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data && data.redirectUrl) {
        const fileName = data.redirectUrl.split("/").pop();
        // 상대 경로로 변경
        window.location.href = `result/${fileName}`;
      } else {
        throw new Error("유효하지 않은 응답 데이터");
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("결과 조회 중 오류 발생:", error);
    if (error.message.includes("유효하지 않은 토큰")) {
      alert("로그인이 필요합니다.");
      window.location.href = "login.html";
    } else {
      alert("결과 조회 중 오류가 발생했습니다.");
      window.location.href = "mainpage.html";
    }
  }
}

// 질문 표시
function displayQuestion() {
  if (currentQuestionIndex >= TOTAL_QUESTIONS) {
    submitAllAnswers();
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionText = currentQuestion.question.replace(/^\d+\.\s*/, "");

  document.getElementById("question").textContent = questionText;
  document.getElementById("step").textContent = `${
    currentQuestionIndex + 1
  }/${TOTAL_QUESTIONS}`;
  document.getElementById("progressBar").style.width = `${
    ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100
  }%`;

  document.getElementById("btn1").textContent =
    currentQuestion.options[0].content;
  document.getElementById("btn2").textContent =
    currentQuestion.options[1].content;

  document.getElementById("btn1").disabled = false;
  document.getElementById("btn2").disabled = false;
}

// 보기 선택 시 호출
async function nextQuestion(optionIndex) {
  document.getElementById("btn1").disabled = true;
  document.getElementById("btn2").disabled = true;

  const currentQuestion = questions[currentQuestionIndex];

  try {
    const response = await fetch(`${BASE_URL}/api/user-answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionId: currentQuestion.id,
        optionId: currentQuestion.options[optionIndex].id,
      }),
    });

    if (!response.ok) throw new Error("답변 저장 실패");

    currentQuestionIndex++;
    displayQuestion();
  } catch (error) {
    console.error("답변 저장 중 오류 발생:", error);
    document.getElementById("btn1").disabled = false;
    document.getElementById("btn2").disabled = false;
  }
}

// 최종 결과 요청
async function submitAllAnswers() {
  try {
    const userId = getUserIdFromToken(token);
    const response = await fetch(
      `${BASE_URL}/api/user-answers/result/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    localStorage.setItem("lastResult", result.name); // 🔥 결과 저장
    redirectToResultPage(result.name);
  } catch (error) {
    console.error("결과 조회 중 오류 발생:", error);
  }
}

// 결과 페이지 이동
function redirectToResultPage(type) {
  const resultPages = {
    BALANCE: "./result/type6.html",
    LOGIC: "./result/type2.html",
    FIXED: "./result/type4.html",
    MENTAL: "./result/type3.html",
    ROMANCE: "./result/type1.html",
    SENSOR: "./result/type5.html",
  };

  const resultPage = resultPages[type];
  window.location.href = resultPage;
}

// 토큰에서 userId 추출
function getUserIdFromToken(token) {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return payload.userId || null;
  } catch (error) {
    console.error("토큰 디코딩 실패:", error);
    return null;
  }
}

// 시작
document.addEventListener("DOMContentLoaded", fetchQuestions);
