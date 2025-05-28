function login() {
  const idInput = document.getElementById("userId");
  const pwInput = document.getElementById("password");
  const idError = document.getElementById("idError");
  const pwError = document.getElementById("pwError");
  const loginBtn = document.getElementById("loginBtn");

  const userId = idInput.value.trim();
  const password = pwInput.value;
  let valid = true;

  idError.textContent = "";
  pwError.textContent = "";
  idInput.classList.remove("error");
  pwInput.classList.remove("error");
  loginBtn.classList.remove("active");

  if (!USERS[userId]) {
    idError.textContent = "존재하지 않는 아이디입니다";
    idInput.classList.add("error");
    valid = false;
  } else if (USERS[userId] !== password) {
    pwError.textContent = "입력한 비밀번호와 일치하지 않습니다";
    pwInput.classList.add("error");
    valid = false;
  }

  if (valid) {
    // 로그인 성공 시 splash로 이동 (두 번째 스플래시)
    window.location.href = "login-splash.html?afterLogin=true";
  }
}
