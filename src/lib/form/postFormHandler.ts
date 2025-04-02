import { FormHandler, withPreventDefault, withInputClear } from "./formHandler";
import { postStore, userStore } from "../../stores";

const handlePostSubmit = (e: Event) => {
  const currentUser = userStore.getState().currentUser;
  if (!currentUser) {
    alert("로그인 후 이용해주세요");
    return;
  }

  const { posts } = postStore.getState();
  const contentElement = document.getElementById(
    "post-content",
  ) as HTMLTextAreaElement;
  const content = contentElement.value;

  const post = {
    id: posts.length + 1,
    author: currentUser.username,
    time: Date.now(),
    content,
    likeUsers: [],
  };

  postStore.setState({
    posts: [...posts, post],
  });
};

export const postFormHandler = (): FormHandler => ({
  handleSubmit: withPreventDefault(
    withInputClear("post-content")(handlePostSubmit),
  ),
});
