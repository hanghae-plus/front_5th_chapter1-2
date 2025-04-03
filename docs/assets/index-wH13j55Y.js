var V = Object.defineProperty;
var z = (e, t, n) =>
  t in e
    ? V(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (e[t] = n);
var v = (e, t, n) => z(e, typeof t != "symbol" ? t + "" : t, n);
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) l(r);
  new MutationObserver((r) => {
    for (const o of r)
      if (o.type === "childList")
        for (const a of o.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && l(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(r) {
    const o = {};
    return (
      r.integrity && (o.integrity = r.integrity),
      r.referrerPolicy && (o.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : r.crossOrigin === "anonymous"
          ? (o.credentials = "omit")
          : (o.credentials = "same-origin"),
      o
    );
  }
  function l(r) {
    if (r.ep) return;
    r.ep = !0;
    const o = n(r);
    fetch(r.href, o);
  }
})();
const _ = () => {
    const e = new Set();
    return { subscribe: (l) => e.add(l), notify: () => e.forEach((l) => l()) };
  },
  G = (e, t) => {
    const { subscribe: n, notify: l } = _();
    let r = { ...e };
    const o = (f) => {
        (r = { ...r, ...f }), l();
      },
      a = () => ({ ...r }),
      i = Object.fromEntries(
        Object.entries(t).map(([f, E]) => [f, (...d) => o(E(a(), ...d))]),
      );
    return { getState: a, setState: o, subscribe: n, actions: i };
  },
  H = (e, t = window.localStorage) => ({
    get: () => JSON.parse(t.getItem(e)),
    set: (o) => t.setItem(e, JSON.stringify(o)),
    reset: () => t.removeItem(e),
  }),
  P = (e) => {
    const { subscribe: t, notify: n } = _(),
      l = () => window.location.pathname,
      r = () => e[l()],
      o = (a) => {
        window.history.pushState(null, null, a), n();
      };
    return (
      window.addEventListener("popstate", () => n()),
      {
        get path() {
          return l();
        },
        push: o,
        subscribe: t,
        getTarget: r,
      }
    );
  };
function s(e, t, ...n) {
  return (
    console.log("createVNode children", n),
    console.log("createVNode children type", typeof n),
    { type: e, props: t, children: T(n) }
  );
}
function T(e) {
  return e
    .flat(1 / 0)
    .map((t) => (t == null || typeof t == "boolean" ? "" : t))
    .filter((t) => t !== "");
}
const u = new Map();
function O(e, t, n) {
  e._eid || (e._eid = Date.now() + Math.random().toString(36).substring(2, 9)),
    u.has(e._eid) || u.set(e._eid, new Map());
  const l = u.get(e._eid);
  l.has(t) || l.set(t, new Set()), l.get(t).add(n);
}
function J(e, t, n) {
  if (!e._eid || !u.has(e._eid)) return;
  const l = u.get(e._eid);
  l.has(t) &&
    (l.get(t).delete(n),
    l.get(t).size === 0 && l.delete(t),
    l.size === 0 && u.delete(e._eid));
}
function W(e) {
  if (e._hasEventListeners) return;
  (e._hasEventListeners = !0),
    [
      "click",
      "mouseover",
      "mouseout",
      "focus",
      "blur",
      "input",
      "change",
      "keydown",
      "keyup",
      "submit",
    ].forEach((n) => {
      e.addEventListener(n, (l) => {
        let r = l.target;
        for (; r && r !== e; ) {
          if (r._eid && u.has(r._eid)) {
            const o = u.get(r._eid);
            if (
              o.has(n) &&
              (o.get(n).forEach((i) => {
                i(l);
              }),
              l.cancelBubble || !l.bubbles)
            )
              break;
          }
          r = r.parentNode;
        }
      });
    });
}
function m(e) {
  if (e == null || typeof e == "boolean") return document.createTextNode("");
  if (typeof e == "string" || typeof e == "number")
    return document.createTextNode(String(e));
  if (Array.isArray(e)) {
    const n = document.createDocumentFragment();
    return (
      e.forEach((l) => {
        l != null && n.appendChild(m(l));
      }),
      n
    );
  }
  if (typeof e.type == "function")
    throw new Error("함수형 컴포넌트는 지원하지 않습니다.");
  const t = document.createElement(e.type);
  return (
    e.props && K(t, e.props),
    e.children &&
      e.children.forEach((n) => {
        n != null && t.appendChild(m(n));
      }),
    t
  );
}
function K(e, t) {
  t &&
    Object.entries(t).forEach(([n, l]) => {
      if (n.startsWith("on") && typeof l == "function") {
        const r = n.toLowerCase().substring(2);
        O(e, r, l);
      } else
        n === "className"
          ? e.setAttribute("class", l)
          : n !== "children" &&
            n !== "key" &&
            (l === !0
              ? e.setAttribute(n, "")
              : l !== !1 && l != null && e.setAttribute(n, l));
    });
}
function g(e) {
  if (e == null || typeof e == "boolean") return "";
  if (typeof e == "string" || typeof e == "number") return String(e);
  if (Array.isArray(e)) return e.flat().map(g).filter(Boolean);
  if (typeof e.type == "function") {
    const n = { ...e.props, children: e.children };
    return g(e.type(n));
  }
  const t = Array.isArray(e.children)
    ? e.children.map(g).filter(Boolean)
    : e.children;
  return { type: e.type, props: e.props, children: t };
}
function R(e, t, n) {
  const l = { ...(n || {}), ...(t || {}) };
  Object.keys(l).forEach((r) => {
    if (r.startsWith("on") && typeof l[r] == "function") {
      const o = r.toLowerCase().substring(2);
      n && typeof n[r] == "function" && J(e, o, n[r]),
        t && typeof t[r] == "function" && O(e, o, t[r]);
    } else
      r !== "children" &&
        r !== "key" &&
        (r === "className"
          ? t && t[r] !== void 0
            ? e.setAttribute("class", t[r])
            : e.removeAttribute("class")
          : !t || t[r] === !1 || t[r] === null || t[r] === void 0
            ? e.removeAttribute(r)
            : t[r] === !0
              ? e.setAttribute(r, "")
              : e.setAttribute(r, t[r]));
  });
}
function j(e, t, n, l = 0) {
  if (n == null) {
    t && e.appendChild(m(t));
    return;
  }
  if (t == null) {
    e.removeChild(e.childNodes[l]);
    return;
  }
  if (
    typeof t == "string" ||
    typeof t == "number" ||
    typeof n == "string" ||
    typeof n == "number"
  ) {
    if (t !== n) {
      const i = m(t);
      e.replaceChild(i, e.childNodes[l]);
    }
    return;
  }
  if (t.type !== n.type) {
    const i = m(t);
    e.replaceChild(i, e.childNodes[l]);
    return;
  }
  R(e.childNodes[l], t.props, n.props);
  const r = t.children ? t.children.length : 0,
    o = n.children ? n.children.length : 0,
    a = Math.max(r, o);
  for (let i = 0; i < a; i++)
    j(
      e.childNodes[l],
      t.children && i < r ? t.children[i] : null,
      n.children && i < o ? n.children[i] : null,
      i,
    );
}
function Y(e, t) {
  const n = t,
    l = g(e);
  if (n.firstChild) j(n, l, n._vNode);
  else {
    const r = m(l);
    n.appendChild(r);
  }
  (n._vNode = l), n._hasEventListeners || (W(n), (n._hasEventListeners = !0));
}
const Q = 1e3,
  N = Q * 60,
  D = N * 60,
  X = D * 24,
  Z = (e) => {
    const t = Date.now() - e;
    return t < N
      ? "방금 전"
      : t < D
        ? `${Math.floor(t / N)}분 전`
        : t < X
          ? `${Math.floor(t / D)}시간 전`
          : new Date(e).toLocaleString();
  },
  b = H("user"),
  $ = 1e3,
  h = $ * 60,
  ee = h * 60,
  c = G(
    {
      currentUser: b.get(),
      loggedIn: !!b.get(),
      posts: [
        {
          id: 1,
          author: "홍길동",
          time: Date.now() - 5 * h,
          content: "오늘 날씨가 정말 좋네요. 다들 좋은 하루 보내세요!",
          likeUsers: [],
        },
        {
          id: 2,
          author: "김철수",
          time: Date.now() - 15 * h,
          content: "새로운 프로젝트를 시작했어요. 열심히 코딩 중입니다!",
          likeUsers: [],
        },
        {
          id: 3,
          author: "이영희",
          time: Date.now() - 30 * h,
          content: "오늘 점심 메뉴 추천 받습니다. 뭐가 좋을까요?",
          likeUsers: [],
        },
        {
          id: 4,
          author: "박민수",
          time: Date.now() - 30 * h,
          content: "주말에 등산 가실 분 계신가요? 함께 가요!",
          likeUsers: [],
        },
        {
          id: 5,
          author: "정수연",
          time: Date.now() - 2 * ee,
          content: "새로 나온 영화 재미있대요. 같이 보러 갈 사람?",
          likeUsers: [],
        },
      ],
      error: null,
    },
    {
      logout(e) {
        return b.reset(), { ...e, currentUser: null, loggedIn: !1 };
      },
    },
  ),
  te = ({
    id: e,
    author: t,
    time: n,
    content: l,
    likeUsers: r,
    activationLike: o = !1,
  }) => {
    const { currentUser: a } = c.getState(),
      i = a == null ? void 0 : a.username,
      f = i && r.includes(i),
      E = () => {
        if (!o) {
          alert("로그인 후 이용해주세요");
          return;
        }
        const d = [...r],
          C = d.indexOf(i);
        C !== -1 ? d.splice(C, 1) : d.push(i);
        const { posts: F } = c.getState(),
          q = F.map((L) => (L.id === e ? { ...L, likeUsers: d } : L));
        c.setState({ posts: q });
      };
    return s(
      "div",
      { className: "bg-white rounded-lg shadow p-4 mb-4" },
      s(
        "div",
        { className: "flex items-center mb-2" },
        s(
          "div",
          null,
          s("div", { className: "font-bold" }, t),
          s("div", { className: "text-gray-500 text-sm" }, Z(n)),
        ),
      ),
      s("p", null, l),
      s(
        "div",
        { className: "mt-2 flex justify-between text-gray-500" },
        s(
          "span",
          {
            className: `like-button cursor-pointer${f ? " text-blue-500" : ""}`,
            onClick: E,
          },
          "좋아요 ",
          r.length,
        ),
        s("span", null, "댓글"),
        s("span", null, "공유"),
      ),
    );
  },
  ne = () => {
    const { posts: e, currentUser: t } = c.getState();
    return s(
      "div",
      { className: "mb-4 bg-white rounded-lg shadow p-4" },
      s("textarea", {
        id: "post-content",
        placeholder: "무슨 생각을 하고 계신가요?",
        className: "w-full p-2 border rounded",
      }),
      s(
        "button",
        {
          id: "post-submit",
          className: "mt-2 bg-blue-600 text-white px-4 py-2 rounded",
          onClick: () => {
            const l = document.getElementById("post-content").value;
            l.trim() &&
              (c.setState({
                posts: [
                  ...e,
                  {
                    id: e.length + 1,
                    content: l,
                    author: t.username,
                    time: Date.now(),
                    likeUsers: [],
                  },
                ],
              }),
              (document.getElementById("post-content").value = ""));
          },
        },
        "게시",
      ),
    );
  },
  M = () =>
    s(
      "header",
      { className: "bg-blue-600 text-white p-4 sticky top-0" },
      s("h1", { className: "text-2xl font-bold" }, "항해플러스"),
    ),
  U = () =>
    s(
      "footer",
      { className: "bg-gray-200 p-4 text-center" },
      s(
        "p",
        null,
        "© $",
        new Date().getFullYear(),
        " 항해플러스. All rights reserved.",
      ),
    ),
  p = {
    value: null,
    get() {
      return this.value;
    },
    set(e) {
      this.value = e;
    },
  },
  A = (e) =>
    window.location.pathname === e
      ? "text-blue-600 font-bold"
      : "text-gray-600";
function k({ onClick: e, children: t, ...n }) {
  return s(
    "a",
    {
      onClick: (r) => {
        r.preventDefault(),
          e == null || e(),
          p.get().push(r.target.href.replace(window.location.origin, ""));
      },
      ...n,
    },
    t,
  );
}
const B = () => {
    const { loggedIn: e } = c.getState(),
      { logout: t } = c.actions;
    return s(
      "nav",
      { className: "bg-white shadow-md p-2 sticky top-14" },
      s(
        "ul",
        { className: "flex justify-around" },
        s("li", null, s(k, { href: "/", className: A("/") }, "홈")),
        !e &&
          s(
            "li",
            null,
            s(k, { href: "/login", className: A("/login") }, "로그인"),
          ),
        e &&
          s(
            "li",
            null,
            s(k, { href: "/profile", className: A("/profile") }, "프로필"),
          ),
        e &&
          s(
            "li",
            null,
            s(
              "a",
              {
                href: "#",
                id: "logout",
                className: "text-gray-600",
                onClick: (n) => {
                  n.preventDefault(), t();
                },
              },
              "로그아웃",
            ),
          ),
      ),
    );
  },
  se = () => {
    const { posts: e, loggedIn: t } = c.getState();
    return s(
      "div",
      { className: "bg-gray-100 min-h-screen flex justify-center" },
      s(
        "div",
        { className: "max-w-md w-full" },
        s(M, null),
        s(B, null),
        s(
          "main",
          { className: "p-4" },
          t && s(ne, null),
          s(
            "div",
            { id: "posts-container", className: "space-y-4" },
            [...e]
              .sort((n, l) => l.time - n.time)
              .map((n) => s(te, { ...n, activationLike: t })),
          ),
        ),
        s(U, null),
      ),
    );
  };
function re(e) {
  const t = { username: e, email: "", bio: "" };
  c.setState({ currentUser: t, loggedIn: !0 }), b.set(t);
}
const le = () =>
    s(
      "div",
      {
        className: "bg-gray-100 flex items-center justify-center min-h-screen",
      },
      s(
        "div",
        { className: "bg-white p-8 rounded-lg shadow-md w-full max-w-md" },
        s(
          "h1",
          { className: "text-2xl font-bold text-center text-blue-600 mb-8" },
          "항해플러스",
        ),
        s(
          "form",
          {
            id: "login-form",
            onSubmit: (t) => {
              t.preventDefault();
              const n = document.getElementById("username").value;
              re(n);
            },
          },
          s("input", {
            type: "text",
            id: "username",
            placeholder: "사용자 이름",
            className: "w-full p-2 mb-4 border rounded",
            required: !0,
          }),
          s("input", {
            type: "password",
            placeholder: "비밀번호",
            className: "w-full p-2 mb-6 border rounded",
            required: !0,
          }),
          s(
            "button",
            {
              type: "submit",
              className: "w-full bg-blue-600 text-white p-2 rounded",
            },
            "로그인",
          ),
        ),
        s(
          "div",
          { className: "mt-4 text-center" },
          s(
            "a",
            { href: "#", className: "text-blue-600 text-sm" },
            "비밀번호를 잊으셨나요?",
          ),
        ),
        s("hr", { className: "my-6" }),
        s(
          "div",
          { className: "text-center" },
          s(
            "button",
            { className: "bg-green-500 text-white px-4 py-2 rounded" },
            "새 계정 만들기",
          ),
        ),
      ),
    ),
  oe = () =>
    s(
      "main",
      {
        className: "bg-gray-100 flex items-center justify-center min-h-screen",
      },
      s(
        "div",
        {
          className: "bg-white p-8 rounded-lg shadow-md w-full text-center",
          style: "max-width: 480px",
        },
        s(
          "h1",
          { className: "text-2xl font-bold text-blue-600 mb-4" },
          "항해플러스",
        ),
        s("p", { className: "text-4xl font-bold text-gray-800 mb-4" }, "404"),
        s(
          "p",
          { className: "text-xl text-gray-600 mb-8" },
          "페이지를 찾을 수 없습니다",
        ),
        s(
          "p",
          { className: "text-gray-600 mb-8" },
          "요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.",
        ),
        s(
          "a",
          {
            href: "/",
            "data-link": "",
            className: "bg-blue-600 text-white px-4 py-2 rounded font-bold",
          },
          "홈으로 돌아가기",
        ),
      ),
    );
function ie(e) {
  const t = { ...c.getState().currentUser, ...e };
  c.setState({ currentUser: t }),
    b.set(t),
    alert("프로필이 업데이트되었습니다.");
}
const ae = () => {
    const { loggedIn: e, currentUser: t } = c.getState(),
      { username: n = "", email: l = "", bio: r = "" } = t ?? {};
    return s(
      "div",
      { className: "bg-gray-100 min-h-screen flex justify-center" },
      s(
        "div",
        { className: "max-w-md w-full" },
        s(M, null),
        s(B, { loggedIn: e }),
        s(
          "main",
          { className: "p-4" },
          s(
            "div",
            { className: "bg-white p-8 rounded-lg shadow-md" },
            s(
              "h2",
              {
                className: "text-2xl font-bold text-center text-blue-600 mb-8",
              },
              "내 프로필",
            ),
            s(
              "form",
              {
                id: "profile-form",
                onSubmit: (a) => {
                  a.preventDefault();
                  const i = new FormData(a.target),
                    f = Object.fromEntries(i);
                  ie(f);
                },
              },
              s(
                "div",
                { className: "mb-4" },
                s(
                  "label",
                  {
                    for: "username",
                    className: "block text-gray-700 text-sm font-bold mb-2",
                  },
                  "사용자 이름",
                ),
                s("input", {
                  type: "text",
                  id: "username",
                  name: "username",
                  className: "w-full p-2 border rounded",
                  value: n,
                  required: !0,
                }),
              ),
              s(
                "div",
                { className: "mb-4" },
                s(
                  "label",
                  {
                    for: "email",
                    className: "block text-gray-700 text-sm font-bold mb-2",
                  },
                  "이메일",
                ),
                s("input", {
                  type: "email",
                  id: "email",
                  name: "email",
                  className: "w-full p-2 border rounded",
                  value: l,
                  required: !0,
                }),
              ),
              s(
                "div",
                { className: "mb-6" },
                s(
                  "label",
                  {
                    for: "bio",
                    className: "block text-gray-700 text-sm font-bold mb-2",
                  },
                  "자기소개",
                ),
                s(
                  "textarea",
                  {
                    id: "bio",
                    name: "bio",
                    rows: "4",
                    className: "w-full p-2 border rounded",
                  },
                  r,
                ),
              ),
              s(
                "button",
                {
                  type: "submit",
                  className:
                    "w-full bg-blue-600 text-white p-2 rounded font-bold",
                },
                "프로필 업데이트",
              ),
            ),
          ),
        ),
        s(U, null),
      ),
    );
  },
  w = class w extends Error {
    constructor() {
      super(w.MESSAGE);
    }
  };
v(w, "MESSAGE", "ForbiddenError");
let y = w;
const S = class S extends Error {
  constructor() {
    super(S.MESSAGE);
  }
};
v(S, "MESSAGE", "UnauthorizedError");
let x = S;
function I() {
  const e = p.get().getTarget() ?? oe,
    t = document.querySelector("#root");
  try {
    Y(s(e, null), t);
  } catch (n) {
    if (n instanceof y) {
      p.get().push("/");
      return;
    }
    if (n instanceof x) {
      p.get().push("/login");
      return;
    }
    console.error(n);
  }
}
p.set(
  P({
    "/": se,
    "/login": () => {
      const { loggedIn: e } = c.getState();
      if (e) throw new y();
      return s(le, null);
    },
    "/profile": () => {
      const { loggedIn: e } = c.getState();
      if (!e) throw new x();
      return s(ae, null);
    },
  }),
);
function ce() {
  p.get().subscribe(I), c.subscribe(I), I();
}
ce();
