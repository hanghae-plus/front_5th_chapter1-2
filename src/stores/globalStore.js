import { createStore } from "../lib";
import { userStorage } from "../storages";

const 초 = 1000;
const 분 = 초 * 60;
const 시간 = 분 * 60;

export const globalStore = createStore(
  {
    currentUser: userStorage.get(),
    loggedIn: Boolean(userStorage.get()),
    posts: [
      {
        id: 1,
        author: "홍길동",
        time: Date.now() - 5 * 분,
        content: "오늘 날씨가 정말 좋네요. 다들 좋은 하루 보내세요!",
        likeUsers: [],
      },
      {
        id: 2,
        author: "김철수",
        time: Date.now() - 15 * 분,
        content: "새로운 프로젝트를 시작했어요. 열심히 코딩 중입니다!",
        likeUsers: [],
      },
      {
        id: 3,
        author: "이영희",
        time: Date.now() - 30 * 분,
        content: "오늘 점심 메뉴 추천 받습니다. 뭐가 좋을까요?",
        likeUsers: [],
      },
      {
        id: 4,
        author: "박민수",
        time: Date.now() - 30 * 분,
        content: "주말에 등산 가실 분 계신가요? 함께 가요!",
        likeUsers: [],
      },
      {
        id: 5,
        author: "정수연",
        time: Date.now() - 2 * 시간,
        content: "새로 나온 영화 재미있대요. 같이 보러 갈 사람?",
        likeUsers: [],
      },
    ],
    error: null,
  },
  {
    logout(state) {
      userStorage.reset();
      return { ...state, currentUser: null, loggedIn: false };
    },
    addPost(state, content) {
      console.log("state", state);
      console.log("content", content);
      const newContent = {
        id: state.posts.length + 1,
        author: state.currentUser.username,
        time: Date.now() * 분,
        content: content,
        likeUsers: [],
      };
      return { ...state, posts: [newContent, ...state.posts] };
    },
    togglePostLike(state, username, postId) {
      const newPosts = state.posts.map((post) => {
        if (post.id === postId) {
          const likeUsers = post.likeUsers;
          const newLikeUsers = likeUsers.includes(username)
            ? likeUsers.filter((name) => name !== username)
            : likeUsers.concat(username);
          return {
            ...post,
            likeUsers: newLikeUsers,
          };
        } else {
          return post;
        }
      });
      return { ...state, posts: newPosts };
    },
  },
);
