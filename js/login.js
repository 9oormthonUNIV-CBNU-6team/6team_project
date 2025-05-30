import { login as loginApi } from "./api/auth.js";
import { getToken } from "./api/config.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const idInput = document.getElementById("userId");
  const pwInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const idError = document.getElementById("idError");
  const pwError = document.getElementById("pwError");

  // 입력 필드 변경 시 버튼 활성화 상태 업데이트
  function toggleLoginButton() {
    if (idInput.value.trim() && pwInput.value.trim()) {
      loginBtn.classList.add("active");
    } else {
      loginBtn.classList.remove("active");
    }
  }

  // 입력 필드 이벤트 리스너
  idInput.addEventListener("input", () => {
    idError.textContent = "";
    toggleLoginButton();
  });

  pwInput.addEventListener("input", () => {
    pwError.textContent = "";
    toggleLoginButton();
  });

  // 회원가입 버튼 클릭 시
  signupBtn.addEventListener("click", () => {
    window.location.href = "signup.html";
  });

  // 로그인 폼 제출 시
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = idInput.value.trim();
    const password = pwInput.value;

    // 입력값 검증
    if (!userId) {
      idError.textContent = "아이디를 입력해주세요.";
      return;
    }
    if (!password) {
      pwError.textContent = "비밀번호를 입력해주세요.";
      return;
    }

    try {
      const response = await loginApi({
        userId: userId,
        password: password,
      });

      // 로그인 성공 시 사용자 정보 저장
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("nickname", response.nickname);

      // JWT 토큰 콘솔 출력
      const token = getToken();
      console.log("로그인 성공! JWT 토큰:", token);
      // id와 userid를 콘솔에 출력
      console.log("id:", userId);
      console.log("userid:", response.userId);

      // 메인 페이지로 이동
      window.location.href = "mainpage.html";
    } catch (error) {
      // 로그인 실패 시 에러 메시지 표시
      if (error.message.includes("아이디")) {
        idError.textContent = error.message;
      } else if (error.message.includes("비밀번호")) {
        pwError.textContent = error.message;
      } else {
        idError.textContent = "로그인에 실패했습니다.";
      }
    }
  });
});
