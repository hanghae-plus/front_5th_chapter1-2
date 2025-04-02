const eventStore = new Map();
const rootStore = new Map();

export function setupEventListeners(root) {
  if (eventStore.size < 1) return;

  Array.from(eventStore.entries()).forEach(([key, handler]) => {
    const eventType = key.split("-")[1];
    root.addEventListener(eventType, handler);

    // 이벤트 제거해주려고 등록
    const element = key.split("-")[0];
    rootStore.set(`${element}-${handler}`, root);
  });
}

// event 를 저장하는데 어떤 event 인지 특정해줘야 함
// element 가 파라미터로 넘어오니까 해당 element도 어딘가에 저장해야됨.
export function addEvent(element, eventType, handler) {
  eventStore.set(`${element}-${eventType}`, handler);
}

export function removeEvent(element, eventType, handler) {
  eventStore.delete(`${element}-${eventType}`, handler);

  // 등록되어 있는 event 제거 근데 어디에 등록되어있지?
  const root = rootStore.get(`${element}-${handler}`);
  root.removeEventListener(eventType, handler);
}
