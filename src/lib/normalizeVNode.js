// 상수 정의
const EMPTY_ARRAY = [];
const EMPTY_STRING = "";

// Falsy 값 체크 함수
const isFalsyValue = (value) =>
  value === null ||
  value === undefined ||
  value === false ||
  value === EMPTY_STRING;

// 기본 타입 처리 함수
const normalizeBasicType = (vNode) => {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return EMPTY_STRING;
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  return null; // 기본 타입이 아님을 표시
};

// 배열 처리 함수
const normalizeArray = (vNodes) =>
  vNodes
    .flat(Infinity)
    .map(normalizeVNode)
    .filter((node) => !isFalsyValue(node));

// 컴포넌트 처리 함수
const normalizeComponent = (vNode) => {
  const props = vNode.props || {};
  const normalizedChildren = vNode.children
    ? normalizeVNode(vNode.children)
    : EMPTY_ARRAY;

  const propsWithChildren = {
    ...props,
    children: normalizedChildren,
  };

  return normalizeVNode(vNode.type(propsWithChildren));
};

// 객체 처리 함수
const normalizeObject = (vNode) => {
  if (typeof vNode.type === "function") {
    return normalizeComponent(vNode);
  }

  return {
    ...vNode,
    children: vNode.children ? normalizeVNode(vNode.children) : EMPTY_ARRAY,
  };
};

export function normalizeVNode(vNode) {
  // 기본 타입 처리
  const normalizedBasicType = normalizeBasicType(vNode);
  if (normalizedBasicType !== null) {
    return normalizedBasicType;
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    return normalizeArray(vNode);
  }

  // 객체 처리
  if (typeof vNode === "object" && vNode !== null) {
    return normalizeObject(vNode);
  }

  return vNode;
}
