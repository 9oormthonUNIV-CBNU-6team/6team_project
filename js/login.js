import { loadSplash } from "./splash-loader.js";
import { login as loginApi } from "./api/auth.js";
import { getToken } from "./api/config.js";

const BASE_URL = "http://52.78.187.191:8080";

document.addEventListener("DOMContentLoaded", async () => {
  await loadSplash(); // splash 불러오기

  const splashWrapper = document.getElementById("splash-wrapper");
  const splashScreen = document.getElementById("splash");
  const loginContent = document.getElementById("loginContent");
  const loginForm = document.getElementById("loginForm");
  const userIdInput = document.getElementById("userId");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const idError = document.getElementById("idError");
  const pwError = document.getElementById("pwError");

  // splash → login 전환
  setTimeout(() => {
    splashScreen.style.opacity = "0";
    setTimeout(() => {
      splashWrapper.remove();
      loginContent.style.display = "block";
      loginContent.style.opacity = "1";
    }, 300);
  }, 2000);

  // 입력 감지
  function checkInputs() {
    const isFormFilled =
      userIdInput.value.trim() !== "" && passwordInput.value.trim() !== "";
    loginBtn.classList.toggle("active", isFormFilled);
  }

  userIdInput.addEventListener("input", checkInputs);
  passwordInput.addEventListener("input", checkInputs);

  function showError(field, errorElement, message) {
    field.classList.add("error");
    errorElement.textContent = message;
    errorElement.classList.add("visible");
  }

  function clearErrors() {
    userIdInput.classList.remove("error");
    passwordInput.classList.remove("error");
    idError.classList.remove("visible");
    pwError.classList.remove("visible");
    idError.textContent = "";
    pwError.textContent = "";
  }

  signupBtn.addEventListener("click", () => {
    window.location.href = "signup.html";
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const userId = userIdInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // splash 재사용
        await loadSplash();

        setTimeout(() => {
          window.location.href = "mainpage.html";
        }, 2000);
      } else {
        if (data.message.includes("존재하지 않는")) {
          showError(userIdInput, idError, "존재하지 않는 아이디입니다.");
        } else {
          showError(passwordInput, pwError, "입력한 비밀번호가 일치하지 않습니다.");
        }
      }
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  });
});
