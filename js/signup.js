import { signup } from "./api/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const submitBtn = document.getElementById("submitBtn");
  const errorMessage = document.getElementById("errorMessage");

  // 필수 입력 필드
  const requiredFields = ["userId", "password", "nickname"];

  // 유효성 검사 패턴
  const validationPatterns = {
    userId: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,20}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
    phone: /^\d{11}$/,
  };

  // 입력값 유효성 검사
  const validateInput = (input) => {
    const pattern = validationPatterns[input.id];
    if (!pattern) return true;

    const isValid = pattern.test(input.value);
    input.classList.toggle("invalid", !isValid);

    // 에러 메시지 표시
    const errorElement = document.getElementById(`error-${input.id}`);
    if (errorElement) {
      if (!isValid) {
        switch (input.id) {
          case "userId":
            errorElement.textContent =
              "아이디는 영문, 숫자 조합 4-20자여야 합니다.";
            break;
          case "password":
            errorElement.textContent =
              "비밀번호는 영문, 숫자 조합 8-16자여야 합니다.";
            break;
          case "phone":
            errorElement.textContent = "전화번호는 숫자 11자리여야 합니다.";
            break;
        }
      } else {
        errorElement.textContent = "";
      }
    }
    return isValid;
  };

  // 필수 필드 확인 및 유효성 검사
  const checkFormValidity = () => {
    const requiredFilled = requiredFields.every((fieldId) => {
      const input = document.getElementById(fieldId);
      return input.value.trim() !== "" && validateInput(input);
    });

    submitBtn.disabled = !requiredFilled;
  };

  // 입력 필드 이벤트 리스너 등록
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      validateInput(input);
      checkFormValidity();
    });
  });

  // X 버튼 클릭 시 로그인 페이지로 이동
  document.querySelector(".close-button").addEventListener("click", () => {
    window.location.href = "login.html";
  });

  // 폼 제출 처리
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 모든 필드의 값을 가져옴
    const formData = {
      userId: document.getElementById("userId").value,
      password: document.getElementById("password").value,
      nickname: document.getElementById("nickname").value,
    };

    // 선택적 필드 추가
    ["email", "phone", "region"].forEach((field) => {
      const value = document.getElementById(field)?.value.trim();
      if (value) formData[field] = value;
    });

    try {
      const response = await signup(formData);

      // 회원가입 성공 시 사용자 정보 저장
      localStorage.setItem("nickname", response.nickname);

      // 환영 페이지로 이동
      window.location.href = "welcome.html";
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    }
  });
});
