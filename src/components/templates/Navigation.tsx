/** @jsx createVNode */
import { createVNode } from "../../lib/vdom";
import { router } from "../../router";
import { userStore } from "../../stores";
import { BASE_PATH } from "../../consts/path";
import { VNode } from "../../lib/vdom";

const getNavItemClass = (path: string) => {
  const currentPath = window.location.pathname;
  return currentPath === BASE_PATH + path
    ? "text-blue-600 font-bold"
    : "text-gray-600";
};

interface LinkProps {
  onClick?: () => void;
  children?: VNode | VNode[];
  [key: string]: unknown;
}

function Link({ onClick, children, ...props }: LinkProps) {
  const handleClick = (e: Event) => {
    e.preventDefault();
    onClick?.();
    const target = e.target as HTMLAnchorElement;
    router.get()?.push(target.href.replace(window.location.origin, ""));
  };
  return (
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export const Navigation = () => {
  const { loggedIn } = userStore.getState();
  const { logout } = userStore.actions;
  return (
    <nav className="bg-white shadow-md p-2 sticky top-14">
      <ul className="flex justify-around">
        <li>
          <Link href="/" className={getNavItemClass("/")}>
            홈
          </Link>
        </li>
        {!loggedIn && (
          <li>
            <Link href="/login" className={getNavItemClass("/login")}>
              로그인
            </Link>
          </li>
        )}
        {loggedIn && (
          <li>
            <Link href="/profile" className={getNavItemClass("/profile")}>
              프로필
            </Link>
          </li>
        )}
        {loggedIn && (
          <li>
            <a
              href="#"
              id="logout"
              className="text-gray-600"
              onClick={(e: Event) => {
                e.preventDefault();
                logout();
              }}
            >
              로그아웃
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};
