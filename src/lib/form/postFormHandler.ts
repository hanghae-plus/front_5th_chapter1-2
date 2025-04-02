import { FormHandler } from "./formHandler";
import { postStore, userStore } from "../../stores";
import { notification } from "../notification";

class PostFormHandlerClass extends FormHandler {
  private handlePostSubmit = (e: Event) => {
    const currentUser = userStore.getState().currentUser;
    if (!currentUser) {
      notification.error("로그인 후 이용해주세요");
      return;
    }

    const content = this.getPostContent();
    this.createPost(content, currentUser.username);
  };

  private getPostContent() {
    const contentElement = document.getElementById(
      "post-content",
    ) as HTMLTextAreaElement;
    return contentElement.value;
  }

  private createPost(content: string, author: string) {
    const { posts } = postStore.getState();
    const post = {
      id: posts.length + 1,
      author,
      time: Date.now(),
      content,
      likeUsers: [],
    };

    postStore.setState({
      posts: [...posts, post],
    });
  }
  handleSubmit = this.withPreventDefault(
    this.withInputClear("post-content")(this.handlePostSubmit),
  );
}

export const postFormHandler = () => new PostFormHandlerClass();
