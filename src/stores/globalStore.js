import { createStore } from "../lib";
import { userStorage } from "../storages";

const seconds = 1000;
const minutes = seconds * 60;
const hours = minutes * 60;

export const globalStore = createStore(
  {
    currentUser: userStorage.get(),
    loggedIn: Boolean(userStorage.get()),
    posts: [
      {
        id: 1,
        author: "홍길동",
        time: Date.now() - 5 * minutes,
        content: "오늘 날씨가 정말 좋네요. 다들 좋은 하루 보내세요!",
        likeUsers: [],
      },
      {
        id: 2,
        author: "김철수",
        time: Date.now() - 15 * minutes,
        content: "새로운 프로젝트를 시작했어요. 열심히 코딩 중입니다!",
        likeUsers: [],
      },
      {
        id: 3,
        author: "이영희",
        time: Date.now() - 30 * minutes,
        content: "오늘 점심 메뉴 추천 받습니다. 뭐가 좋을까요?",
        likeUsers: [],
      },
      {
        id: 4,
        author: "박민수",
        time: Date.now() - 30 * minutes,
        content: "주말에 등산 가실 minutes 계신가요? 함께 가요!",
        likeUsers: [],
      },
      {
        id: 5,
        author: "정수연",
        time: Date.now() - 2 * hours,
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
    togglePostLike(state, postId) {
      const updatedPosts = state.posts.map((post) => {
        if (post.id === postId) {
          const username = state.currentUser.username;
          const isLiked = post.likeUsers.includes(username);
          const updatedLikeUsers = isLiked
            ? post.likeUsers.filter((user) => user !== username)
            : [...post.likeUsers, username];

          return {
            ...post,
            likeUsers: updatedLikeUsers,
          };
        }

        return post;
      });

      return {
        ...state,
        posts: updatedPosts,
      };
    },
    addPost(state, content) {
      const newPost = {
        id:
          state.posts.length > 0
            ? Math.max(...state.posts.map((post) => post.id)) + 1
            : 1,
        author: state.currentUser.username,
        time: Date.now(),
        content: content.trim(),
        likeUsers: [],
      };

      const updatedPosts = [newPost, ...state.posts];

      return {
        ...state,
        posts: updatedPosts,
      };
    },
  },
);
