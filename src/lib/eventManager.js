const events = {};
const roots = new Set();

// 이벤트 핸들러 등록
export function addEvent(element, eventType, handler) {
  if (!events[eventType]) {
    events[eventType] = new Map();
  }

  if (!events[eventType].has(element)) {
    events[eventType].set(element, new Set());
  }

  events[eventType].get(element).add(handler);
}

// 이벤트 핸들러 제거
export function removeEvent(element, eventType, handler) {
  if (!events[eventType] || !events[eventType].has(element)) {
    return;
  }

  const handlers = events[eventType].get(element);
  handlers.delete(handler);

  if (handlers.size === 0) {
    events[eventType].delete(element);
  }
}

// 이벤트 처리 함수
function handleEvent(event) {
  const { type, target } = event;

  if (!events[type]) return;

  let node = target;
  while (node) {
    if (events[type].has(node)) {
      const handlers = events[type].get(node);
      for (const handler of handlers) {
        handler(event);
      }
    }

    if (event.cancelBubble || !event.bubbles) break;

    node = node.parentElement;
    if (!node) break;
  }
}

// 루트 요소에 이벤트 리스너 설정
export function setupEventListeners(root) {
  if (roots.has(root)) return;

  roots.add(root);

  // 모든 등록된 이벤트 타입에 대해 리스너 추가
  for (const eventType in events) {
    root.addEventListener(eventType, handleEvent);
  }
}
