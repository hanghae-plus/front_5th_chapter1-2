import { MOCK_POSTS } from "../consts/post";
import { Post } from "../types/post";
import { createStore } from "../lib/store";

interface PostState {
  posts: Post[];
}

interface PostActions {
  addPost: (state: PostState, content: string, author: string) => PostState;
  toggleLike: (state: PostState, postId: number, username: string) => PostState;
}

const initialState: PostState = {
  posts: MOCK_POSTS,
};

const initialActions: PostActions = {
  addPost(state: PostState, content: string, author: string) {
    const newPost = {
      id: state.posts.length + 1,
      author,
      time: Date.now(),
      content,
      likeUsers: [],
    };
    return {
      ...state,
      posts: [...state.posts, newPost],
    };
  },
  toggleLike(state: PostState, postId: number, username: string) {
    return {
      ...state,
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          const hasLiked = post.likeUsers.includes(username);
          return {
            ...post,
            likeUsers: hasLiked
              ? post.likeUsers.filter((user) => user !== username)
              : [...post.likeUsers, username],
          };
        }
        return post;
      }),
    };
  },
};

export const postStore = createStore(initialState, initialActions);
