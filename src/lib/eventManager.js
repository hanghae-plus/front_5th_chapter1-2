let _$root = null;
const eventHandlers = new Map(); // 이벤트 핸들러 저장
const eventTypes = new Set(); // 이벤트 타입 저장

export function addEvent(element, eventType, handler) {
  eventTypes.add(eventType);

  if (!eventHandlers.has(element)) {
    eventHandlers.set(element, {});
  }
  const elementHandlers = eventHandlers.get(element);

  elementHandlers[eventType] = handler; // 핸들러 추가
}

export function removeEvent(element, eventType) {
  if (eventHandlers.has(element)) {
    const elementHandlers = eventHandlers.get(element);
    delete elementHandlers[eventType];
  }
}
export function setupEventListeners(root) {
  _$root = root;
  eventTypes.forEach((eventType) => {
    root.removeEventListener(eventType, handleEvent);
    root.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(event) {
  let target = event.target; // 시작점
  let type = event.type;
  // target -> root
  while (target && target !== _$root) {
    // 1. 타겟이 이벤트 핸들러에 등록되어 있는가? 2. 이벤트 타입에 대한 핸들러가 있는가?
    if (eventHandlers.has(target) && eventHandlers.get(target)[type]) {
      eventHandlers.get(target)[type](event); // 핸들러 실행
    }
    target = target.parentElement; // 부모 요소로 타겟 변경
  }
}
