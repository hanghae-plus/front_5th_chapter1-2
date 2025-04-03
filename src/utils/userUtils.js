export const checkLoggedIn = (loggedIn) => {
  if (!loggedIn) {
    alert("로그인 후 이용해주세요");
    return false;
  }
  return true;
};
