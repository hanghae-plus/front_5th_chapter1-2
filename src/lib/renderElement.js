import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const oldNodeMap = new Map(); // 이전 가상 노드 저장

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.

  // vNode를 정규화 한 다음에
  // createElement로 노드를 만들고
  // container에 삽입하고
  // 이벤트를 등록합니다.

  //[심화]
  // 최초 렌더링 시에는 createElement로 실행
  // 리렌더링일 때에는 updateElement로 실행

  const oldNode = oldNodeMap.get(container);
  const newNode = normalizeVNode(vNode); // 노드 정규화

  if (oldNodeMap.has(container)) {
    updateElement(container, newNode, oldNode); // 리렌더링
  } else {
    container.appendChild(createElement(newNode)); // 최초 렌더링
  }

  setupEventListeners(container); // 컨테이너 전체의 이벤트 위임 설정
  oldNodeMap.set(container, newNode); // 다음 렌더링 시 이전 상태와 비교 가능하도록 저장
}
