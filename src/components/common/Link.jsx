/** @jsx createVNode */
import { createVNode } from "../../lib";
import { router } from "../../router";

export const Link = ({ onClick, children, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick?.();
    router.get().push(e.target.href.replace(window.location.origin, ""));
  };
  return (
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  );
};
