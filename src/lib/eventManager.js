// 이벤트 타입을 저장하는 집합
const registeredEventTypes = new Set();

// DOM 요소와 이벤트 핸들러를 연결하는 맵
const eventHandlerMap = new Map();

// 컨테이너에 이벤트 리스너 설정하기
export function setupEventListeners(container) {
  // 컨테이너에 이벤트 정보 저장할 공간이 없으면 생성
  if (!container._events) {
    container._events = new Set();
  }

  // 등록된 모든 이벤트 타입에 대해
  registeredEventTypes.forEach((eventType) => {
    // 이미 등록되지 않은 이벤트 타입만 추가
    if (!container._events.has(eventType)) {
      // 이벤트 발생시 handleEvent 함수 실행
      container.addEventListener(eventType, handleEvent);
      // 등록 완료 표시
      container._events.add(eventType);
    }
  });
}

// 요소에 이벤트 핸들러 추가
export function addEvent(element, eventType, handler) {
  // 모든 인자가 존재하는지 확인
  if (!element || !eventType || !handler) return;

  // 새 이벤트 타입 등록
  registeredEventTypes.add(eventType);

  // 이 요소의 이벤트 정보가 없으면 새로 생성
  if (!eventHandlerMap.has(element)) {
    eventHandlerMap.set(element, {});
  }

  // 요소의 이벤트 핸들러 정보 가져오기
  const elementEvents = eventHandlerMap.get(element);

  // 해당 이벤트 타입에 핸들러 저장
  elementEvents[eventType] = handler;
}

// 이벤트 처리 함수
function handleEvent(event) {
  // 이벤트가 발생한 요소
  let element = event.target;

  // 요소에서 시작해 부모로 올라가며 확인 (이벤트 버블링)
  while (element) {
    // 이 요소에 이벤트 핸들러가 있는지 확인
    if (eventHandlerMap.has(element)) {
      // 요소의 모든 이벤트 핸들러 가져오기
      const handlers = eventHandlerMap.get(element);
      // 현재 발생한 이벤트 타입의 핸들러 가져오기
      const handler = handlers[event.type];

      // 핸들러가 있으면 실행
      if (handler) {
        handler.call(element, event);
      }
    }

    // 부모 요소로 이동
    element = element.parentNode;
  }
}

export function removeEvent(element, eventType, handler) {
  if (!eventHandlerMap.has(element)) return;

  const elementEvents = eventHandlerMap.get(element);

  if (elementEvents[eventType] === handler) {
    // 특정 이벤트 타입만 제거
    delete elementEvents[eventType];
  }
  // 요소에 등록된 이벤트가 없으면 맵에서 요소 자체를 제거
  if (Object.keys(elementEvents).length === 0) {
    eventHandlerMap.delete(element);
  }
}
