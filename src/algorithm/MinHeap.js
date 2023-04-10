class MinHeap {
    constructor() {
      this.heap = [ null ];
      this.size = 0;
    }
  
    popMin() {
      if (this.size === 0) {
        return null 
      }
      const min = this.heap[1];
      this.heap[1] = this.heap[this.size];
      this.heap.pop();
      this.size--;
      this.heapify();
      return min;
    }
  
    add(newNode) {
      let isRepeted = false;
      this.heap.forEach((node, nodeIndex) => {
        if(nodeIndex === 0)
          return;

        if(node.col === newNode.col && node.row === newNode.row)
          isRepeted = true;
      });

      if(isRepeted)
        return;

      this.heap.push(newNode);
      this.size++;
      this.bubbleUp();
    }
  
    bubbleUp() {
      let current = this.size;
      while (current > 1 && this.heap[getParent(current)].distance > this.heap[current].distance) {
        this.swap(current, getParent(current));
        current = getParent(current);
      }
    }
  
    heapify() {
      let current = 1;
      let leftChild = getLeft(current);
      let rightChild = getRight(current);
  
      while (this.canSwap(current, leftChild, rightChild)) {
        // Only compare left & right if they both exist
        if (this.exists(leftChild) && this.exists(rightChild)) {
  
          // Make sure to swap with the smaller of the two children
          if (this.heap[leftChild].distance < this.heap[rightChild].distance) {
            this.swap(current, leftChild);
            current = leftChild;
          } else {
            this.swap(current, rightChild);
            current = rightChild;
          }
        } else {
          // If only one child exist, always swap with the left
          this.swap(current, leftChild);
          current = leftChild;
        }
        leftChild = getLeft(current);
        rightChild = getRight(current);
  
      }
    }
  
    exists(index) {
      return index <= this.size;
    }
  
    canSwap(current, leftChild, rightChild) {
      // Check that one of the possible swap conditions exists
      return (
        this.exists(leftChild) && this.heap[current].distance > this.heap[leftChild].distance
        || this.exists(rightChild) && this.heap[current].distance > this.heap[rightChild].distance
      );
    }
  
    swap(a, b) {
      [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
    }
  
  }
  
  const getParent = current => Math.floor((current / 2));
  const getLeft = current => current * 2;
  const getRight = current => current * 2 + 1;
  
  module.exports = MinHeap;