/**
 * Validator - OOP Utility Class for client-side validation.
 */
export default class Validator {
    static validateBook(data) {
        let errors = {};
        let valid = true;

        if (!data.title?.trim()) { errors.title = "Title is required"; valid = false; }
        if (!data.author?.trim()) { errors.author = "Author is required"; valid = false; }
        if (!data.isbn?.trim()) { errors.isbn = "ISBN is required"; valid = false; }
        if (!data.category?.trim()) { errors.category = "Category is required"; valid = false; }
        
        if (data.price === undefined || data.price === '' || isNaN(data.price) || data.price <= 0) {
            errors.price = "Valid positive price is required";
            valid = false;
        }
        
        if (data.stockQuantity === undefined || data.stockQuantity === '' || isNaN(data.stockQuantity) || data.stockQuantity < 0) {
            errors.stockQuantity = "Valid stock quantity is required";
            valid = false;
        }

        return { valid, errors };
    }
}
