package com.luxurybooks.dsa;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class MergeSort {
    public static <T> List<T> sort(List<T> list, Comparator<? super T> comparator) {
        if (list == null || list.size() <= 1) return list;
        List<T> copy = new ArrayList<>(list);
        mergeSort(copy, 0, copy.size() - 1, comparator);
        return copy;
    }

    private static <T> void mergeSort(List<T> list, int left, int right, Comparator<? super T> comparator) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(list, left, mid, comparator);
            mergeSort(list, mid + 1, right, comparator);
            merge(list, left, mid, right, comparator);
        }
    }

    private static <T> void merge(List<T> list, int left, int mid, int right, Comparator<? super T> comparator) {
        List<T> temp = new ArrayList<>();
        int i = left;
        int j = mid + 1;

        while (i <= mid && j <= right) {
            if (comparator.compare(list.get(i), list.get(j)) <= 0) {
                temp.add(list.get(i));
                i++;
            } else {
                temp.add(list.get(j));
                j++;
            }
        }

        while (i <= mid) {
            temp.add(list.get(i));
            i++;
        }

        while (j <= right) {
            temp.add(list.get(j));
            j++;
        }

        for (int k = 0; k < temp.size(); k++) {
            list.set(left + k, temp.get(k));
        }
    }
}
