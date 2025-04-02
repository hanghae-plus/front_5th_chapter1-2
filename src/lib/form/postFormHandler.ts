import { FormHandler } from "./formHandler";
import { postStore, userStore } from "../../stores";
import { notification } from "../notification";
import { MESSAGES } from "../../consts/messages";
import { ELEMENT_IDS } from "../../consts/elements";
import { getValue } from "../dom";

class PostFormHandlerClass extends FormHandler {
  private handlePostSubmit = (e: SubmitEvent) => {
    const currentUser = userStore.getState().currentUser;
    if (!currentUser) {
      notification.error(MESSAGES.LOGIN_REQUIRED);
      return;
    }

    const content = getValue(ELEMENT_IDS.POST_CONTENT);
    this.createPost(content, currentUser.username);
  };

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
    this.withInputClear(ELEMENT_IDS.POST_CONTENT)(this.handlePostSubmit),
  );
}

export const postFormHandler = () => new PostFormHandlerClass();
