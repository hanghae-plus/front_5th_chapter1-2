// 1. addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에 저장하거나 삭제합니다.
// 2. setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.

const eventTypes = []; //등록된 이벤트 타입 목록 - 모든 등록된 이벤트 타입을 추적
const elementMap = new Map(); //이벤트 핸들러 저장소 - 요소별 이벤트 핸들러 저장소

const handleEvent = (e) => {
  const targetMap = elementMap.get(e.target);
  const handler = targetMap?.get(e.type);
  if (handler) {
    handler.call(e.target, e);
  }
};

export function setupEventListeners(root) {
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventTypes.includes(eventType)) {
    eventTypes.push(eventType);
  }
  const targetMap = elementMap.get(element) || new Map();
  if (targetMap.get(eventType) === handler) return;
  targetMap.set(eventType, handler);
  elementMap.set(element, targetMap);
}

export function removeEvent(element, eventType, handler) {
  const targetMap = elementMap.get(element);
  if (!targetMap) return;
  if (targetMap.get(eventType) === handler) {
    targetMap.delete(eventType);
  }
  if (targetMap.size === 0) {
    elementMap.delete(element);
  }
}
