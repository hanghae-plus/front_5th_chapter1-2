const eventStore = new Map(); // 이벤트 저장소
const eventTypes = new Set(); // 이벤트 타입 저장소

export function setupEventListeners(root) {
  // 모든 이벤트 타입에 대해 root에 한 번만 리스너 등록
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

// 이벤트 핸들러 함수
const handleEvent = (e) => {
  // 이벤트가 발생한 요소의 이벤트 맵 가져오기
  const elementEvents = eventStore.get(e.target);
  // 이벤트 타입에 대한 핸들러 가져오기
  const handler = elementEvents?.get(e.type);
  // 핸들러가 있으면 실행
  if (handler) {
    handler.call(e.target, e);
  }
};

export function addEvent(element, eventType, handler) {
  // 새로운 이벤트 타입 추가
  eventTypes.add(eventType);

  // 이벤트 저장소에 요소가 없으면 생성
  if (!eventStore.has(element)) {
    eventStore.set(element, new Map());
  }

  // 이벤트 타입, 핸들러 저장
  const elementEvents = eventStore.get(element);
  elementEvents.set(eventType, handler);
}

export function removeEvent(element, eventType, handler) {
  // 이벤트 저장소에 요소가 없으면 종료
  if (!eventStore.has(element)) return;

  // 요소의 이벤트 맵 가져오기
  const elementEvents = eventStore.get(element);
  // 지정된 핸들러와 이벤트 타입이 일치하면 삭제
  if (elementEvents.get(eventType) === handler) {
    elementEvents.delete(eventType);
  }

  // 이벤트가 모두 제거되면 요소도 저장소에서 제거
  if (elementEvents.size === 0) {
    eventStore.delete(element);
  }
}
