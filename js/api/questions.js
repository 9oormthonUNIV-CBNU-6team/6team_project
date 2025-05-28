import { API_BASE_URL, createHeaders } from "./config.js";

// 모든 질문 가져오기
export const getAllQuestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/questions`, {
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error("질문 목록을 가져오는데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 특정 질문 가져오기
export const getQuestionById = async (questionId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/questions/${questionId}`,
      {
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("질문을 가져오는데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 질문에 대한 옵션 가져오기
export const getOptionsByQuestionId = async (questionId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/options/question/${questionId}`,
      {
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("옵션을 가져오는데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 사용자 답변 제출
export const submitAnswer = async (answerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user-answers`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(answerData),
    });

    if (!response.ok) {
      throw new Error("답변 제출에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 사용자의 답변 목록 가져오기
export const getUserAnswers = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user-answers/${userId}`, {
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error("답변 목록을 가져오는데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 사용자의 결과 가져오기
export const getUserResult = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/user-answers/result/${userId}`,
      {
        headers: createHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("결과를 가져오는데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 결과 코드로 결과 정보 가져오기
export const getResultByCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/results/${code}`, {
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error("결과 정보를 가져오는데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
