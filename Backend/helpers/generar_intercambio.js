class Node {
    constructor(val) {
      this.val = val;
      this.next = null;
      this.prev = null;
    }
  }
  
  class DoublyLinkedList {
    constructor() {
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    
    push(val) {
      const newNode = new Node(val);
      if (this.length === 0) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
      }
      this.length++;
      return this;
    }
    
    pop() {
      if (this.length === 0) return undefined;
      const temp = this.tail;
      if (this.length === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.tail = temp.prev;
        this.tail.next = null;
        temp.prev = null;
      }
      this.length--;
      return temp;
    }
    
    shift() {
      if (this.length === 0) return undefined;
      const temp = this.head;
      if (this.length === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = temp.next;
        this.head.prev = null;
        temp.next = null;
      }
      this.length--;
      return temp;
    }
    
    unshift(val) {
      const newNode = new Node(val);
      if (this.length === 0) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        newNode.next = this.head;
        this.head.prev = newNode;
        this.head = newNode;
      }
      this.length++;
      return this;
    }
  }
  
/* 
let list = new DoublyLinkedList;
  list.push(1);
  list.push(2);
  list.push(3);
  list.push(4);
  list.push(5);
*/

module.exports = {
    DoublyLinkedList
}