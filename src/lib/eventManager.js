const eventMap = new Map();
let rootElement = null;
const activeHandlers = new Map();
// export function setupEventListeners(root) {

// }

export function addEvent(element, eventType, handler) {
  console.log("1");
  // 이벤트 타입이 없으면 생성. ex) click:{}
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }

  // 이벤트 타입에 이벤트 핸들러를 등록. ex) click:{div:handler, button:handler}
  const handlers = eventMap.get(eventType);
  handlers.set(element, handler);
}

export function removeEvent(element, eventType) {
  if (!eventMap.has(eventType)) {
    return;
  }

  const handlers = eventMap.get(eventType);
  if (handlers.has(element)) {
    handlers.delete(element);
  }
}

// export function removeEvent(element, eventType, handler) {}

export function setupEventListeners(root) {
  // 이벤트 맵에 등록된 이벤트를 root에 등록
  console.log("2");
  rootElement = root;

  // 이전에 등록된 이벤트 핸들러 제거
  activeHandlers.forEach((handler, eventType) => {
    rootElement.removeEventListener(eventType, handler);
  });
  activeHandlers.clear();

  // 이벤트 맵에 등록된 이벤트를 root에 다시 등록
  eventMap.forEach((handlers, eventType) => {
    const eventHandler = (e) => {
      // 이벤트 타겟이 등록된 엘리먼트인지 확인
      for (const [element, handler] of handlers.entries()) {
        if (element === e.target || element.contains(e.target)) {
          handler(e);
          break;
        }
      }
    };
    rootElement.addEventListener(eventType, eventHandler);
    activeHandlers.set(eventType, eventHandler);
  });
}
