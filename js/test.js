const BASE_URL = "http://52.78.187.191:8080";
let currentQuestionIndex = 0;
let questions = [];
let token = localStorage.getItem("token");
const TOTAL_QUESTIONS = 10;

// 질문 목록 가져오기
async function fetchQuestions() {
  try {
    const response = await fetch(`${BASE_URL}/api/questions`);
    const allQuestions = await response.json();
    questions = allQuestions.slice(0, TOTAL_QUESTIONS);
    displayQuestion();
  } catch (error) {
    console.error("질문을 가져오는데 실패했습니다:", error);
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
  document.getElementById("step").textContent = `${currentQuestionIndex + 1}/${TOTAL_QUESTIONS}`;
  document.getElementById("progressBar").style.width = `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%`;

  document.getElementById("btn1").textContent = currentQuestion.options[0].content;
  document.getElementById("btn2").textContent = currentQuestion.options[1].content;

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
    const response = await fetch(`${BASE_URL}/api/user-answers/result/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    BALANCE: "result-balance.html",
    LOGIC: "result-logic.html",
    FIXED: "result-fixed.html",
    MENTAL: "result-mental.html",
    ROMANCE: "result-romance.html",
    SENSOR: "result-sensor.html",
  };

  const resultPage = resultPages[type] || "result-balance.html";
  window.location.href = resultPage;
}

// 토큰에서 userId 추출
function getUserIdFromToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload).userId;
  } catch (error) {
    console.error("토큰 디코딩 실패:", error);
    return null;
  }
}

// 시작
document.addEventListener("DOMContentLoaded", fetchQuestions);
