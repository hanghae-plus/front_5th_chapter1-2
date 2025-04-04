// 애플리케이션에서 사용하는 모든 에러 타입과 메시지 정의
export const ERROR_TYPES = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  INVALID_INPUT: "INVALID_INPUT",
  SERVER_ERROR: "SERVER_ERROR",
  CONTENT_EMPTY: "CONTENT_EMPTY",
};

export const ERROR_MESSAGES = {
  [ERROR_TYPES.AUTH_REQUIRED]: "로그인 후 이용해주세요",
  [ERROR_TYPES.INVALID_INPUT]: "입력값이 올바르지 않습니다",
  [ERROR_TYPES.SERVER_ERROR]: "서버 오류가 발생했습니다",
  [ERROR_TYPES.CONTENT_EMPTY]: "내용을 입력해주세요",
};
