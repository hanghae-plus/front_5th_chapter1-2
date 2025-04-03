export type Subscriber<T> = (state: T) => void;

export class Store<T> {
  private state: T;
  private subscribers: Subscriber<T>[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.push(subscriber);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
    };
  }

  private notify(): void {
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }
}
