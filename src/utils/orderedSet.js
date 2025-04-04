/**
 * 순서가 보장되는 Set 클래스
 * eventManager에서 필요한 메서드만 구현
 */
export class OrderedSet {
  constructor() {
    this._elements = [];
  }

  has(value) {
    return this._elements.includes(value);
  }

  add(value) {
    if (!this.has(value)) {
      this._elements.push(value);
    }
    return this;
  }

  delete(value) {
    const index = this._elements.indexOf(value);
    if (index !== -1) {
      this._elements.splice(index, 1);
      return true;
    }
    return false;
  }

  forEach(callback, thisArg) {
    this._elements.forEach((element) => {
      callback.call(thisArg, element, element, this);
    });
  }

  get size() {
    return this._elements.length;
  }
}
