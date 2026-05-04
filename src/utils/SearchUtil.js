/**
 * SearchUtil - OOP Utility Class for client-side searching
 * Implements DSA: Binary Search and Linear Search
 */
export default class SearchUtil {
    
    /**
     * Binary Search implementation for sorted books
     * DSA: O(log n) time complexity. Assumes the array is sorted by title.
     * Used for instant client-side searching before falling back to API if needed.
     */
    static binarySearch(sortedBooks, titleTerm) {
        if (!sortedBooks || sortedBooks.length === 0 || !titleTerm) return null;
        
        const term = titleTerm.toLowerCase();
        let low = 0;
        let high = sortedBooks.length - 1;

        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            let midTitle = sortedBooks[mid].title.toLowerCase();
            
            // Standard binary search logic
            if (midTitle === term) {
                return sortedBooks[mid];
            } else if (midTitle < term) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return null; 
    }

    /**
     * Linear Search implementation for generic partial matches (e.g. searching users by name)
     * DSA: O(n) time complexity.
     */
    static linearSearch(items, key, term) {
        if (!items || !term) return items;
        const lowercaseTerm = term.toLowerCase();
        return items.filter(item => 
            item[key] && item[key].toString().toLowerCase().includes(lowercaseTerm)
        );
    }
}
