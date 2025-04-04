import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // null, undefined, boolean 값을 빈 문자열로 변환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  if (typeof vNode === "function") {
    throw new Error(
      "컴포넌트는 normalizeVNode로 정규화한 후에 createElement를 사용해야 합니다.",
    );
  }

  if (Array.isArray(vNode)) {
    /**
     * DocumentFragment는  메모리 상에만 존재하는 가벼운 DOM 이다.
     * 실제 DOM 트리에 직접 연결되지 않는 최소한의 문서 객체로,
     * 여러 노드를 그룹화하는 임시 컨테이너 역할
     * - 가벼움: 일반 DOM 노드보다 가볍고 최소한의 리소스만 사용
     * - 리플로우 최소화: 여러 요소를 한 번에 DOM에 추가할 수 있어 성능
     */
    const fragment = document.createDocumentFragment();
    vNode.forEach((element) => {
      const childElement = createElement(element);
      fragment.appendChild(childElement);
    });
    return fragment;
  }

  // 일반 가상 DOM 노드의 경우 해당 타입의 요소 생성
  const $el = document.createElement(vNode.type);

  updateAttributes($el, vNode.props);

  vNode.children.map(createElement).forEach((child) => $el.appendChild(child));

  // 변환된 dom을 반환한다.
  return $el;
}

/**
 * vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
 * @param {HTMLElement} $el - 속성을 적용할 DOM 요소
 * @param {Object} props - 적용할 속성 객체 (이벤트 핸들러 포함)
 */
function updateAttributes($el, props) {
  if (!props) return;
  // 정의한 속성을 삽입한다.
  Object.entries(props)
    .filter(
      ([value]) => value !== null && value !== undefined && value !== false,
    )
    .forEach(([attr, value]) => {
      // 이벤트 리스너 처리 (onClick -> click 이벤트로 변환)
      if (attr.startsWith("on")) {
        const eventType = attr.slice(2).toLowerCase();
        addEvent($el, eventType, value);
        return; // 이벤트 핸들러가 일반 속성으로도 처리되는 것 방지
      }
      // className을 class로 변환
      else if (attr === "className") {
        $el.setAttribute("class", value);
      } else {
        $el.setAttribute(attr, value);
      }
    });
}
