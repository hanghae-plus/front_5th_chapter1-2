// 이벤트 타입별로 핸들러를 관리하는 Map
const eventTypeMap = new Map();
let rootElement = null;

export function setupEventListeners(root) {
  rootElement = root;
  // 이벤트 타입별로 root에 리스너 등록
  eventTypeMap.forEach((_, eventType) => {
    setupEventListenerForType(eventType);
  });
}

function setupEventListenerForType(eventType) {
  if (!rootElement) return;

  rootElement.addEventListener(eventType, (e) => {
    // 이벤트가 발생한 요소부터 root까지의 경로를 따라 핸들러 실행
    let target = e.target;
    const path = [];

    // 이벤트 경로 수집
    while (target && target !== rootElement) {
      path.push(target);
      target = target.parentNode;
    }
    path.push(rootElement);

    // 경로를 따라 핸들러 실행
    /**
     *  역순으로 순회하는 이유: 자식 요소의 핸들러가 부모 요소의 핸들러를 오버라이드하기 위해
     *  예를 들어, 버튼 클릭 이벤트에 대해 버튼 자체에 핸들러를 등록하면 버튼 클릭 이벤트가 발생할 때 버튼 자체의 핸들러가 먼저 실행되고,
     *  그 후 부모 요소의 핸들러가 실행된다.
     *  이렇게 하면 부모 요소의 핸들러가 자식 요소의 핸들러를 오버라이드하는 것을 방지할 수 있다.
     */
    for (let i = path.length - 1; i >= 0; i--) {
      const currentTarget = path[i];
      const handlers = eventTypeMap.get(eventType);

      if (handlers) {
        const handler = handlers.get(currentTarget);
        if (handler) {
          try {
            handler(e);
          } catch (error) {
            console.error("Error in event handler:", error);
          }
          if (e.isPropagationStopped) break;
        }
      }
    }
  });
}

export function addEvent(element, eventType, handler) {
  // 이벤트 타입별로 핸들러 맵 생성
  if (!eventTypeMap.has(eventType)) {
    eventTypeMap.set(eventType, new Map());
    // 새로운 이벤트 타입이 추가되면 리스너도 등록
    setupEventListenerForType(eventType);
  }

  // 해당 이벤트 타입의 핸들러 맵에 요소와 핸들러 등록
  const handlers = eventTypeMap.get(eventType);
  handlers.set(element, handler);
}

export function removeEvent(element, eventType) {
  // 이벤트 타입에 해당하는 핸들러 맵이 있으면 요소의 핸들러 제거
  if (eventTypeMap.has(eventType)) {
    const handlers = eventTypeMap.get(eventType);
    handlers.delete(element);

    // 핸들러가 모두 제거되면 이벤트 타입도 제거
    if (handlers.size === 0) {
      eventTypeMap.delete(eventType);
    }
  }
}
