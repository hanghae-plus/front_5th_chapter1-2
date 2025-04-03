import { updateAttributes } from "../utils/attributesUtils";
import { isTextNodeValue, shouldSkipRendering } from "../utils/renderUtils";
import { isDOMRenderable } from "../utils/vNodeUtils";

export function createElement(vNode) {
  if (shouldSkipRendering(vNode)) {
    return document.createTextNode("");
  }

  if (isTextNodeValue(vNode)) {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.filter(isDOMRenderable).forEach((child) => {
      fragment.appendChild(createElement(child));
    });

    return fragment;
  }

  if (vNode && typeof vNode.type === "function") {
    throw new Error(
      `함수형 컴포넌트(${vNode.type.name})가 직접 렌더링 시도되었습니다. 컴포넌트 사용 전 normalizeVNode 함수로 처리해 주세요.`,
    );
  }

  const el = document.createElement(vNode.type);

  if (vNode.props) {
    updateAttributes(el, vNode.props);
  }

  vNode.children.filter(isDOMRenderable).forEach((child) => {
    el.appendChild(createElement(child));
  });

  return el;
}
