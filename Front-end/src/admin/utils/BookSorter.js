/**
 * BookSorter - OOP Utility Class for client-side sorting
 * Implements DSA: QuickSort
 */
export default class BookSorter {

    /**
     * Client-side generic QuickSort logic tailored for Books or Orders
     * DSA: O(n log n)
     */
    static quickSort(items, key) {
        if (!items || items.length <= 1) return items;
        
        let sorted = [...items];
        this._quickSortHelper(sorted, 0, sorted.length - 1, key);
        return sorted;
    }

    static _quickSortHelper(arr, low, high, key) {
        if (low < high) {
            let pi = this._partition(arr, low, high, key);
            this._quickSortHelper(arr, low, pi - 1, key);
            this._quickSortHelper(arr, pi + 1, high, key);
        }
    }

    static _partition(arr, low, high, key) {
        let pivot = arr[high];
        let i = (low - 1);

        for (let j = low; j < high; j++) {
            let condition = false;
            
            // Depending on key type
            if (typeof arr[j][key] === 'string') {
                condition = arr[j][key].localeCompare(pivot[key]) <= 0;
            } else {
                condition = arr[j][key] <= pivot[key];
            }

            if (condition) {
                i++;
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1;
    }
}
