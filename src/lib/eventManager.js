function createEventManager() {
  const eventHandlers = new Map();
  const setupEvents = new Set();
  const observers = [];
  const eventListeners = new Map();
  let rootElement = null;

  // 옵저버 등록
  function addObserver(observer) {
    observers.push(observer);
  }

  // 이벤트 타입 추가 시 알람
  function notifyEventTypeAdded(eventType) {
    observers.forEach((observer) => {
      observer.onEventTypeAdded(eventType);
    });
  }

  // 특정 이벤트 타입에 대한 리스너 설정
  function setupEventListener(eventType) {
    if (!rootElement || setupEvents.has(eventType)) return;

    // 실제 DOM 이벤트 핸들러 (이벤트 위임)
    const eventListener = (event) => {
      // 현재 시점의 이벤트 핸들러
      const elements = eventHandlers.get(eventType);
      if (!elements) return;

      let target = event.target;

      while (target && target !== rootElement) {
        if (elements.has(target)) {
          const handlers = [...elements.get(target)];
          handlers.forEach((handler) => {
            handler(event);
          });
        }

        if (event.cancelBubble) break;

        // 상위 요소로 이동
        target = target.parentNode;
      }
    };

    // 이벤트 리스너 저장
    eventListeners.set(eventType, eventListener);

    rootElement.addEventListener(eventType, eventListener, false);

    setupEvents.add(eventType);
  }

  function resetEventListeners() {
    if (!rootElement) return;

    eventListeners.forEach((listener, type) => {
      rootElement.removeEventListener(type, listener, false);
    });

    setupEvents.clear();
    eventListeners.clear();
  }

  // 루트 요소 변경 시 이벤트 리스너 재설정
  function setRootElement(element) {
    if (rootElement === element) return;

    // 이전 리스너 정리
    resetEventListeners();
    // 새 루트 요소 설정
    rootElement = element;

    eventHandlers.forEach((_, eventType) => {
      setupEventListener(eventType);
    });
  }

  function addEvent(element, eventType, handler) {
    if (!eventHandlers.has(eventType)) {
      eventHandlers.set(eventType, new Map());
      notifyEventTypeAdded(eventType);
    }

    const elements = eventHandlers.get(eventType);

    if (!elements.has(element)) {
      elements.set(element, []);
    }

    // 중복 등록 방지
    const handlers = elements.get(element);
    if (handlers.indexOf(handler) === -1) {
      handlers.push(handler);
    }
  }

  function removeEvent(element, eventType, handler) {
    if (!eventHandlers.has(eventType)) return;

    const elements = eventHandlers.get(eventType);
    if (!elements.has(element)) return;

    const handlers = elements.get(element);
    const index = handlers.indexOf(handler);

    if (index > -1) {
      handlers.splice(index, 1);

      // 요소에 더이상 핸들러가 없으면 항목 제거
      if (handlers.length === 0) {
        elements.delete(element);
      }
    }
  }

  return {
    addObserver,
    notifyEventTypeAdded,
    setupEventListener,
    setRootElement,
    addEvent,
    removeEvent,
  };
}

// 옵저버 생성 함수
function createEventListenerObserver(eventManager) {
  const observer = {
    onEventTypeAdded(eventType) {
      eventManager.setupEventListener(eventType);
    },
  };

  eventManager.addObserver(observer);
  return observer;
}

// 싱글톤 인스턴스 생성
const eventManager = createEventManager();
createEventListenerObserver(eventManager);

export function setupEventListeners(root) {
  eventManager.setRootElement(root);
}

export function addEvent(element, eventType, handler) {
  eventManager.addEvent(element, eventType, handler);
}

export function removeEvent(element, eventType, handler) {
  eventManager.removeEvent(element, eventType, handler);
}
