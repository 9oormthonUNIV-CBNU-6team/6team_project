import { login as loginApi } from "./api/auth.js";
import { getToken } from "./api/config.js";

const BASE_URL = "http://52.78.187.191:8080";

document.addEventListener("DOMContentLoaded", () => {
  const splashScreen = document.getElementById("splash");
  const loginContent = document.getElementById("loginContent");
  const loginForm = document.getElementById("loginForm");
  const userIdInput = document.getElementById("userId");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const idError = document.getElementById("idError");
  const pwError = document.getElementById("pwError");

  // 초기 스플래시 화면 표시 후 로그인 화면으로 전환 (2초)
  setTimeout(() => {
    splashScreen.style.opacity = "0";
    setTimeout(() => {
      splashScreen.style.display = "none";
      loginContent.style.display = "block";
      loginContent.style.opacity = "1";
    }, 300);
  }, 2000);

  // 입력 필드 변경 감지
  function checkInputs() {
    const isFormFilled =
      userIdInput.value.trim() !== "" && passwordInput.value.trim() !== "";
    loginBtn.classList.toggle("active", isFormFilled);
  }

  userIdInput.addEventListener("input", checkInputs);
  passwordInput.addEventListener("input", checkInputs);

  // 에러 표시 함수
  function showError(field, errorElement, message) {
    field.classList.add("error");
    errorElement.textContent = message;
    errorElement.classList.add("visible");
  }

  // 에러 초기화 함수
  function clearErrors() {
    userIdInput.classList.remove("error");
    passwordInput.classList.remove("error");
    idError.classList.remove("visible");
    pwError.classList.remove("visible");
    idError.textContent = "";
    pwError.textContent = "";
  }

  // 회원가입 버튼 클릭 시
  signupBtn.addEventListener("click", () => {
    window.location.href = "signup.html";
  });

  // 로그인 폼 제출 시
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const userId = userIdInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // 로그인 화면 페이드 아웃
        loginContent.style.opacity = "0";

        // 스플래시 화면 표시
        splashScreen.style.display = "flex";
        splashScreen.style.opacity = "1";

        // 2초 후 메인페이지로 이동
        setTimeout(() => {
          window.location.href = "mainpage.html";
        }, 2000);
      } else {
        if (data.message.includes("존재하지 않는")) {
          showError(userIdInput, idError, "존재하지 않는 아이디입니다.");
        } else {
          showError(
            passwordInput,
            pwError,
            "입력한 비밀번호가 일치하지 않습니다."
          );
        }
      }
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  });
});
