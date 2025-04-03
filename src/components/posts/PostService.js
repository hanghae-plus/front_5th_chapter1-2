import { globalStore } from "../../stores";
import { isAuthCheck } from "../../utils";

const PostService = ({ postId } = {}) => {
  const user = { ...globalStore.getState().currentUser };

  // 좋아요 클릭
  const onClickLike = () => {
    if (!isAuthCheck()) {
      alert("로그인 후 이용해주세요");
      return;
    }
    globalStore.actions.likePost(postId, user.username);
  };

  const submitAddPost = (textValue) => {
    if (!isAuthCheck()) {
      alert("로그인 후 이용해주세요");
      return;
    }

    globalStore.actions.addPost(textValue);
  };

  return { onClickLike, submitAddPost };
};

export default PostService;
