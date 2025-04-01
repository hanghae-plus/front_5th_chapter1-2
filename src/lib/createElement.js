import { isEmptyStrType, isNumericOrStr } from "../utils/typeUtils";

export function createElement(vNode) {
  if (isEmptyStrType(vNode))
    return { nodeType: Node.TEXT_NODE, textContent: "" };
  if (isNumericOrStr(vNode))
    return { nodeType: Node.TEXT_NODE, textContent: String(vNode) };

  if (Array.isArray(vNode)) {
    const childNodes = vNode.map((item) => ({
      tagName: item.type.toUpperCase(),
    }));

    return {
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
      childNodes: childNodes,
    };
  }

  if (typeof vNode.type === "function") {
    throw new Error("함수 컴포넌트는 createElement로 처리할 수 없습니다.");
  }

  // 컴포넌트를 element로 만들어 반환하기
  const { type, props, children } = vNode;
  const element = document.createElement(type);

  if (props) {
    Object.keys(props).forEach((key) => {
      const attributeName = key === "className" ? "class" : key;

      // 이벤트라면 HTML 속성에 문자열을 추가하지 않도록 작업
      if (key.startsWith("on")) {
        const eventType = key.toLowerCase().slice(2);
        element.addEventListener(eventType, props[key]);
      } else {
        element.setAttribute(attributeName, props[key]);
      }
    });
  }

  if (children && Array.isArray(children)) {
    children.forEach((child) => {
      const childElement = createElement(child);
      if (childElement.nodeType === Node.TEXT_NODE) {
        element.appendChild(document.createTextNode(childElement.textContent));
      } else {
        element.appendChild(childElement);
      }
    });
  }

  return element;
}
