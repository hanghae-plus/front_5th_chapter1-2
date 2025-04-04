/**
 * 주어진 ID 배열에서 새로운 ID를 생성합니다.
 * @param {number[]} ids - ID 배열
 * @returns {number} 새로운 ID
 */
export const generateNewId = (ids) => {
  return Math.max(...ids, 0) + 1;
};
