class LinkedListNode {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

export class LinkedList {
  constructor(...values) {
    this.length = 0;
    this.head = undefined;
    this.tail = undefined;

    for (const value of values) {
      this.addBack(value);
    }
  }

  get isEmpty() {
    return this.length === 0;
  }

  toArray() {
    let array = [];

    for (let node = this.head; node; node = node.next) {
      array.push(node.value);
    }

    return array;
  }

  removeFront() {
    if (this.isEmpty) {
      throw new Error(`removeFront() called on empty LinkedList`);
    }

    const node = this.head;

    if (this.head === this.tail) {
      this.head = this.tail = undefined;
    } else {
      this.head = this.head.next;
    }

    this.length -= 1;
    return node.value;
  }

  addFront(value) {
    const node = new LinkedListNode(value, this.head);

    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.head = node;
    }

    this.length += 1;
    return value;
  }

  addBack(value) {
    const node = new LinkedListNode(value);

    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.length += 1;
    return value;
  }
}
