export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === true ||
    vNode === false
  ) {
    vNode = "";
    return vNode;
  }

  // typeof는 항상 문자열을 반환한다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }
  // if(typeof vNode === "number") {
  //   return String(vNode);
  // }
}
