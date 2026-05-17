package com.luxurybooks.dsa;

public class CustomQueue<T> {
    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data) {
            this.data = data;
        }
    }

    private Node<T> front = null;
    private Node<T> rear = null;
    private int size = 0;

    public void enqueue(T element) {
        Node<T> newNode = new Node<>(element);
        if (isEmpty()) {
            front = newNode;
        } else {
            rear.next = newNode;
        }
        rear = newNode;
        size++;
    }

    public T dequeue() {
        if (isEmpty()) return null;
        T data = front.data;
        front = front.next;
        if (front == null) {
            rear = null;
        }
        size--;
        return data;
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return front == null;
    }
}
