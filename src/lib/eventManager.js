/**
 * Refactor
 * 1. 하나의 DOM에 여러 이벤트를 할당할 수 있도록 변경해보기
 * - addEvent와 setupEventListeners에서 한 DOM 요소에 하나의 이벤트만 할당할 수 있는 형태다.
 * - Map으로 엘리먼트와 이벤트를 연결해 관리하고 있기 때문이다.
 * - 이벤트 핸들러를 배열로 관리하면 해결할 수 있을 듯 하다.
 *
 * 2. Map을 WeakMap으로 구현해봐도 좋을 것 같다.
 * - Map은 GC가 자동으로 삭제 대상으로 보지 않는 문제가 있음
 */

const eventMap = new Map();
let rootElement = null;

// setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.
export function setupEventListeners(root) {
  // 새로운 root로 바꾸기 전 기존 root의 리서너를 모두 제거함
  if (rootElement && rootElement !== root) {
    eventMap.forEach((_, eventType) => {
      rootElement.removeEventListener(eventType, handleEvent);
    });
  }

  rootElement = root;
  // 이벤트 위임
  eventMap.forEach((_, eventType) => {
    rootElement.addEventListener(eventType, handleEvent);
  });
}

/**
 * Refactor
 * 1. 버블링, 캡처링 제어와 연결되도록 코드를 수정해볼 수 있을 것 같음
 */

// 이벤트 위임과 제거에 사용되는 공용 이벤트 처리기
const handleEvent = (e) => {
  const { type, target } = e;
  const handlerMap = eventMap.get(type);

  let currentTarget = target;
  while (currentTarget && currentTarget !== rootElement.parentNode) {
    if (handlerMap.has(currentTarget)) {
      const handler = handlerMap.get(currentTarget);
      handler(e);
    }
    currentTarget = currentTarget.parentNode;
  }
};

// addEvent를 통해 element에 대한 이벤트 함수를 저장합니다.
export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }

  const handlerMap = eventMap.get(eventType);
  handlerMap.set(element, handler);
}

// removeEvent를 통해 element에 대한 이벤트 함수를 삭제합니다.
export function removeEvent(element, eventType) {
  if (!eventMap.has(eventType)) {
    return;
  }

  const handlerMap = eventMap.get(eventType);
  if (handlerMap.has(element)) {
    handlerMap.delete(element);
  }

  // 해당 이벤트 타입에 핸들러가 없을 경우에 이벤트 타입 자료 구조 자체를 삭제함
  if (!handlerMap.size) {
    eventMap.delete(eventType);

    if (rootElement) {
      rootElement.removeEventListener(eventType, handleEvent);
    }
  }
}
