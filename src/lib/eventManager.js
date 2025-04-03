// 전역 저장소: 이벤트 종류별로 element-handler를 관리
const delegatedEvents = new Map();
// 컨테이너에 이벤트 리스너가 중복 등록되지 않도록 체크
const registeredContainers = new Set();

export function setupEventListeners(root) {
  // 중복 방지
  if (registeredContainers.has(root)) return;
  registeredContainers.add(root);

  delegatedEvents.forEach((_, eventType) => {
    root.addEventListener(eventType, (event) => {
      const target = event.target;
      const eventMap = delegatedEvents.get(eventType);
      if (!eventMap) return;

      const handlers = eventMap.get(target);
      if (!handlers || handlers.length === 0) return;

      // stopPropagation()이 원래 핸들러에서 실행되었으면 버블링 도중 위임 핸들러 실행되지 않음
      // → 우리가 등록한 위임 핸들러는 항상 실행됨. 단, 위임된 handler 내부에서 stopPropagation은 정상 동작.
      handlers.forEach((handler) => {
        handler(event);
      });
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!delegatedEvents.has(eventType)) {
    delegatedEvents.set(eventType, new Map());
  }

  const eventMap = delegatedEvents.get(eventType);

  // 다중 핸들러 지원을 위해 배열로 관리
  if (!eventMap.has(element)) {
    eventMap.set(element, []);
  }
  eventMap.get(element).push(handler);
}

export function removeEvent(element, eventType, handler) {
  const eventMap = delegatedEvents.get(eventType);
  if (!eventMap || !eventMap.has(element)) return;

  const handlers = eventMap.get(element);
  const index = handlers.indexOf(handler);
  if (index > -1) {
    handlers.splice(index, 1);
  }

  // 핸들러 배열이 비면 element 자체를 제거
  if (handlers.length === 0) {
    eventMap.delete(element);
  }
}
