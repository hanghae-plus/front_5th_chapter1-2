/** @jsx createVNode */
import { createVNode } from "../../lib";
import { createPath } from "../../utils/createPath";
import { router } from "../../router";
import { BASE_URL } from "../../constants/baseURL";

export function Link({ onClick, children, href, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    onClick?.();
    router.get().push(href);
  };

  return (
    <a href={""} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
