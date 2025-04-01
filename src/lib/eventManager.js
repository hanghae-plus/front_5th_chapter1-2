const eventHandlers = new Map();

export function setupEventListeners(root) {
  // 1️⃣ eventHandlers에 저장된 모든 핸들러의 이벤트 타입을 수집해서 Set에 저장 → 중복 제거
  const eventTypes = new Set();

  //등록된 이벤트 타입을 Set에 저장
  eventHandlers.forEach((handlers) => {
    Object.keys(handlers).forEach((type) => {
      eventTypes.add(type);
    });
  });

  // 2️⃣ 이벤트 타입별로 root에 리스너 한 개씩만 등록
  eventTypes.forEach((type) => {
    // 3️⃣ 실제 DOM 특정 요소에서 이벤트

    // 4️⃣ 이벤트가 root까지 버블링되면서 등록된 리스너 실행
    root.addEventListener(type, (e) => {
      let target = e.target;

      // 5️⃣ e.target부터 루트까지의 이벤트 경로를 따라가면서 저장
      const path = [];
      while (target && target !== root) {
        path.push(target);
        target = target.parentNode;
      }

      // 6️⃣ 경로를 따라가며 역순으로 핸들러 실행
      // 역순으로 순회하는 이유:
      // 1. 실제 DOM 이벤트의 캡처링/버블링 순서와 동일하게 동작하기 위함
      // 2. 부모 -> 자식 순서로 이벤트가 전파되어야 stopPropagation() 등이 의도한대로 동작함
      for (let i = path.length - 1; i >= 0; i--) {
        const currentTarget = path[i];
        const elementHandlers = eventHandlers.get(currentTarget);

        if (elementHandlers[type] && elementHandlers) {
          elementHandlers[type](e); // 핸들러 실행
          if (e.isPropagationStopped) break; // 이벤트 전파 중단되면 루프 탈출
        }
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  // elements의의 대한 핸들러 맵이 없으면 새로 생성
  if (!eventHandlers.has(element)) {
    eventHandlers.set(element, {});
  }
  // elements의 핸들러 맵에서 해당 이벤트 타입에 핸들러 할당
  const handlers = eventHandlers.get(element);
  handlers[eventType] = handler;

  console.log(`✅ addEvent 실행됨: ${eventType} ->`, element, handler);
}

// 요소에서 이벤트 핸들러를 제거하는 함수
export function removeEvent(element, eventType, handler) {
  const handlers = eventHandlers.get(element);
  // 해당 요소의 특정 이벤트 타입에 등록된 핸들러가 제거하려는 핸들러와 동일한 경우에만 제거
  if (handlers && handlers[eventType] === handler) {
    delete handlers[eventType];
  }
}
