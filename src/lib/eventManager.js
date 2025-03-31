// 전역 객체로 이벤트 저장
const eventStorage = new Map();

// 특정 요소에 이벤트 저장
export function addEvent(element, eventType, handler) {
  if (!eventStorage.has(element)) eventStorage.set(element, new Map());

  const elementEvents = eventStorage.get(element);

  if (!elementEvents.has(eventType)) elementEvents.set(eventType, new Set());

  elementEvents.get(eventType).add(handler);
}

// 특정 요소에서 이벤트 제거
export function removeEvent(element, eventType, handler) {
  if (eventStorage.has(element)) {
    const elementEvents = eventStorage.get(element);

    if (elementEvents.has(eventType)) {
      const handlers = elementEvents.get(eventType);
      handlers.delete(handler);

      if (handlers.size === 0) {
        elementEvents.delete(eventType);
      }
    }

    if (elementEvents.size === 0) {
      eventStorage.delete(element);
    }
  }
}

// 이벤트 위임 처리
export function setupEventListeners(root) {
  root.addEventListener("click", (event) => handleEvent(event, "click"));
  root.addEventListener("input", (event) => handleEvent(event, "input"));
  root.addEventListener("change", (event) => handleEvent(event, "change"));
}

// 이벤트 전파 처리
function handleEvent(event, eventType) {
  let target = event.target;

  while (target) {
    if (eventStorage.has(target) && eventStorage.get(target).has(eventType)) {
      eventStorage
        .get(target)
        .get(eventType)
        .forEach((handler) => handler(event));
    }
    target = target.parentElement; // 부모 요소로 이동 (Event Delegation)
  }
}
