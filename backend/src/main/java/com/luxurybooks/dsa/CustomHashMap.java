package com.luxurybooks.dsa;

import java.util.ArrayList;
import java.util.List;

public class CustomHashMap<K, V> {
    private static class Entry<K, V> {
        K key;
        V value;
        Entry<K, V> next;

        Entry(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }

    private static final int INITIAL_CAPACITY = 32;
    private Entry<K, V>[] table;
    private int size = 0;

    @SuppressWarnings("unchecked")
    public CustomHashMap() {
        table = new Entry[INITIAL_CAPACITY];
    }

    private int getBucketIndex(K key) {
        if (key == null) return 0;
        return Math.abs(key.hashCode()) % table.length;
    }

    public void put(K key, V value) {
        int index = getBucketIndex(key);
        Entry<K, V> head = table[index];

        while (head != null) {
            if ((key == null && head.key == null) || (key != null && key.equals(head.key))) {
                head.value = value;
                return;
            }
            head = head.next;
        }

        Entry<K, V> newEntry = new Entry<>(key, value);
        newEntry.next = table[index];
        table[index] = newEntry;
        size++;
    }

    public V get(K key) {
        int index = getBucketIndex(key);
        Entry<K, V> head = table[index];

        while (head != null) {
            if ((key == null && head.key == null) || (key != null && key.equals(head.key))) {
                return head.value;
            }
            head = head.next;
        }
        return null;
    }

    public boolean containsKey(K key) {
        return get(key) != null;
    }

    public List<V> values() {
        List<V> list = new ArrayList<>();
        for (Entry<K, V> kvEntry : table) {
            Entry<K, V> head = kvEntry;
            while (head != null) {
                list.add(head.value);
                head = head.next;
            }
        }
        return list;
    }

    public int size() {
        return size;
    }
}
