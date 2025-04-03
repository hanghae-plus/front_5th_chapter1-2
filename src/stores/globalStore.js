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
    login(state, username) {
      const user = { username, email: "", bio: "" };
      userStorage.set(user);
      return { ...state, currentUser: user, loggedIn: true };
    },
    logout(state) {
      userStorage.reset();
      return { ...state, currentUser: null, loggedIn: false };
    },
    likePost(state, id) {
      if (!state.loggedIn || !id) {
        if (!state.loggedIn) {
          alert("로그인 후 이용해주세요");
        }
        return state;
      }

      const updatedPosts = state.posts.map((post) => {
        if (post.id === id) {
          const likeUsers = Array.isArray(post.likeUsers)
            ? [...post.likeUsers]
            : [];
          const likeIndex = likeUsers.indexOf(state.currentUser.username);

          if (likeIndex === -1) {
            // 좋아요 추가
            likeUsers.push(state.currentUser.username);
          } else {
            // 좋아요 제거 (토글)
            likeUsers.splice(likeIndex, 1);
          }

          return {
            ...post,
            likeUsers,
          };
        }
        return post;
      });

      return { ...state, posts: updatedPosts };
    },
    addPost(state, content) {
      if (!state.loggedIn || !state.currentUser || !content) {
        return state;
      }

      try {
        // 현재 사용자 이름 확인
        const username = state.currentUser.username;

        if (!username) {
          console.error("사용자 이름이 없습니다.");
          return state;
        }

        // 새로운 ID 생성 (기존 ID 중 최대값 + 1)
        const maxId = state.posts.reduce(
          (max, post) => Math.max(max, post.id || 0),
          0,
        );

        const newPost = {
          id: maxId + 1,
          author: username, // 로그인한 사용자 이름으로 설정
          time: Date.now(),
          content,
          likeUsers: [],
        };

        const updatedPosts = [newPost, ...state.posts];

        return { ...state, posts: updatedPosts };
      } catch (error) {
        console.error("포스트 추가 중 오류 발생:", error);
        return state;
      }
    },
  },
);
