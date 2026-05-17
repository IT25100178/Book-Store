// src/dsa/structures.js
// Custom DSA implementations for BookStore component

// ===== Custom HashMap: O(1) ISBN/ID -> Book lookup cache =====
export class BookHashMap {
  constructor(size = 16) {
    this.buckets = new Array(size).fill(null).map(() => []);
    this.size = 0;
  }

  _hash(key) {
    let hash = 0;
    const str = String(key);
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % this.buckets.length;
    }
    return Math.abs(hash);
  }

  put(key, value) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }
    bucket.push([key, value]);
    this.size++;
  }

  get(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    return null;
  }

  has(key) {
    return this.get(key) !== null;
  }

  getSize() {
    return this.size;
  }
}

// ===== Custom Stack: Recently Viewed books =====
export class RecentlyViewedStack {
  constructor(maxSize = 10) {
    this.items = JSON.parse(sessionStorage.getItem('recentlyViewedBooks') || '[]');
    this.maxSize = maxSize;
  }

  push(bookId) {
    // Remove if already exists (move to top)
    this.items = this.items.filter(id => id !== bookId);
    // Add to top
    this.items.unshift(bookId);
    // Limit size
    if (this.items.length > this.maxSize) {
      this.items.pop();
    }
    sessionStorage.setItem('recentlyViewedBooks', JSON.stringify(this.items));
  }

  peek() {
    return this.items.length > 0 ? this.items[0] : null;
  }

  getAll() {
    return [...this.items];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// ===== Custom Merge Sort: Sort reviews by date or rating =====
export function mergeSort(arr, compareFn) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFn);
  const right = mergeSort(arr.slice(mid), compareFn);
  return merge(left, right, compareFn);
}

function merge(left, right, compareFn) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
}

// ===== Custom Binary Search: Search books by price in sorted list =====
export function binarySearchByPrice(sortedBooks, targetPrice) {
  let left = 0;
  let right = sortedBooks.length - 1;
  let closest = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedBooks[mid].price === targetPrice) return mid;
    if (sortedBooks[mid].price < targetPrice) {
      closest = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return closest;
}

// ===== Custom Linked List: Breadcrumb navigation chain =====
export class BreadcrumbList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(label, path) {
    const node = { label, path, next: null };
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push({ label: current.label, path: current.path });
      current = current.next;
    }
    return result;
  }
}

// ===== Custom Queue: Waitlist for out-of-stock books =====
export class WaitlistQueue {
  constructor() {
    this.items = [];
  }

  enqueue(userId) {
    this.items.push(userId);
    return this.items.length;
  }

  dequeue() {
    return this.items.shift();
  }

  position(userId) {
    const idx = this.items.indexOf(userId);
    return idx === -1 ? -1 : idx + 1;
  }

  size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
