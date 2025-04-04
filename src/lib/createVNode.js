//import { globalStore } from "../stores/globalStore";

export function createVNode(type, props, ...children) {
  const flatChildren = children
    .flat(Infinity)
    .filter((v) => v === 0 || Boolean(v));
  if (typeof type === "function") {
    return {
      type,
      props: { ...props, children: flatChildren },
      children: [],
    };
  }

  return {
    type,
    props,
    children: flatChildren,
  };
}

// const h = createVNode;
// const result = (
//   h('div',{className:'bg-gray-100 min-h-screen flex justify-center'},
//     h('div',{className: 'max-w-md w-full'},
//       h(Header),
//       h(Navigation),
//       h('main',{className:'p-4'},
//       h(PostForm),
//       h('div', {id:'container' , className: 'space-y-4'},
//         ...posts
//           .sort((a,b)=>b.time - a.time)
//           .map((props) => h(Post,{...props,activationLike:false}))
//       )
//       ),
//     )
//   )
// )
