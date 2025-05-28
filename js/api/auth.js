import { API_BASE_URL, createHeaders, setToken } from "./config.js";

// 회원가입
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("회원가입에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 로그인
export const login = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error("로그인에 실패했습니다.");
    }

    const data = await response.json();
    setToken(data.token);
    return data;
  } catch (error) {
    throw error;
  }
};
