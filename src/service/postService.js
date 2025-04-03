import { globalStore } from "../stores";

const postService = () => {
  const { posts, loggedIn, currentUser } = globalStore.getState();
  // const user = userStorage.get(); // loggedIn됐는데 안됨?

  const createPost = (content) => {
    if (loggedIn && currentUser) {
      const username = currentUser.username;
      const lastId = Math.max(...posts.map((post) => post.id));

      const newPost = {
        id: lastId + 1,
        author: username,
        time: Date.now(),
        content,
        likeUsers: [],
      };
      globalStore.setState({ posts: [...posts, newPost] });
    } else {
      alert("로그인 후 이용해주세요");
      // TODO: auth 가드 추가하기?
    }
  };

  const updatePostLike = (e, id) => {
    console.log("update clicked");
    // 로그인 한 사용자
    if (loggedIn) {
      const username = currentUser.username;

      /** 전역 상태에서 가져온 posts의 복사본을 바탕으로 업데이트 */
      const updatedPosts = posts.map((post) => {
        if (post.id == id) {
          const isAlreadyLiked = post.likeUsers.includes(username);

          if (isAlreadyLiked) {
            const likeUsersExceptMe = post.likeUsers.filter(
              (likeUser) => likeUser !== username,
            );
            console.log("you already liked it", likeUsersExceptMe);
            return { ...post, likeUsers: likeUsersExceptMe };
          } else {
            console.log("you liked!", [...post.likeUsers, username]);
            return { ...post, likeUsers: [...post.likeUsers, username] };
          }
        }

        return post;
      });
      console.log("updatedPosts is", updatedPosts);

      globalStore.setState({ posts: updatedPosts });
    }
    // 로그인하지 않은 사용자
    else {
      alert("로그인 후 이용해주세요");
      // TODO: auth 가드 추가하기?
    }
  };

  return { createPost, updatePostLike };
};

export default postService;
