import { Store } from "./store";
import { Post } from "../types/post";
import { MOCK_POSTS } from "../consts/post";
interface PostState {
  posts: Post[];
}

class PostStore extends Store<PostState> {
  constructor() {
    const initialPosts = MOCK_POSTS;

    super({ posts: initialPosts });
  }

  addPost(post: Omit<Post, "id" | "time" | "likeUsers">) {
    const { posts } = this.getState();
    const newPost: Post = {
      ...post,
      id: posts.length + 1,
      time: Date.now(),
      likeUsers: [],
    };

    this.setState({
      posts: [...posts, newPost],
    });
  }

  deletePost(id: number) {
    const { posts } = this.getState();
    this.setState({
      posts: posts.filter((post) => post.id !== id),
    });
  }

  likePost(postId: number, username: string) {
    const { posts } = this.getState();
    this.setState({
      posts: posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likeUsers: post.likeUsers.includes(username)
              ? post.likeUsers.filter((user) => user !== username)
              : [...post.likeUsers, username],
          };
        }
        return post;
      }),
    });
  }
}

export const postStore = new PostStore();
