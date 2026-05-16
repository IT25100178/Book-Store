import axios from 'axios';

const BASE = 'http://localhost:8080/api/admin';

export const api = {
    // Dashboard
    getDashboardStats: () => axios.get(`${BASE}/dashboardStats`),

    // Books
    getBooks: (sort, minPrice, maxPrice) => {
        let url = `${BASE}/books`;
        const params = new URLSearchParams();
        if (sort) params.append('sort', sort);
        if (minPrice != null) params.append('minPrice', minPrice);
        if (maxPrice != null) params.append('maxPrice', maxPrice);
        const q = params.toString();
        return axios.get(q ? `${url}?${q}` : url);
    },
    searchBooks: (title) => axios.get(`${BASE}/books/search?title=${title}`),
    addBook: (book) => axios.post(`${BASE}/books`, book),
    updateBook: (id, book) => axios.put(`${BASE}/books/${id}`, book),
    deleteBook: (id) => axios.delete(`${BASE}/books/${id}`),
    bulkDeleteBooks: (ids) => axios.post(`${BASE}/books/bulk-delete`, ids),
    undoDeleteBook: () => axios.post(`${BASE}/books/undo-delete`),

    // Users
    getUsers: () => axios.get(`${BASE}/users`),
    searchUsers: (name) => axios.get(`${BASE}/users/search?name=${name}`),
    toggleUserStatus: (id) => axios.put(`${BASE}/users/${id}/status`),
    getUserOrderedBooks: (id) => axios.get(`${BASE}/users/${id}/ordered-books`),

    // Orders
    getOrders: (sort) => axios.get(`${BASE}/orders${sort ? `?sort=${sort}` : ''}`),
    updateOrderStatus: (id, status) => axios.put(`${BASE}/orders/${id}/status`, { status }),

    // Authors
    getAuthors: () => axios.get(`${BASE}/authors`),
    searchAuthors: (prefix) => axios.get(`${BASE}/authors/search?prefix=${prefix}`),
    getAuthor: (id) => axios.get(`${BASE}/authors/${id}`),
    getAuthorBooks: (id) => axios.get(`${BASE}/authors/${id}/books`),
    addAuthor: (author) => axios.post(`${BASE}/authors`, author),
    updateAuthor: (id, author) => axios.put(`${BASE}/authors/${id}`, author),
    deleteAuthor: (id) => axios.delete(`${BASE}/authors/${id}`),
    undoDeleteAuthor: () => axios.post(`${BASE}/authors/undo-delete`),

    // Genres
    getGenres: () => axios.get(`${BASE}/genres`),
    getGenre: (id) => axios.get(`${BASE}/genres/${id}`),
    getGenreBooks: (id) => axios.get(`${BASE}/genres/${id}/books`),
    getRelatedGenres: (id) => axios.get(`${BASE}/genres/${id}/related`),
    getMostConnectedGenre: () => axios.get(`${BASE}/genres/most-connected`),
    addGenre: (genre) => axios.post(`${BASE}/genres`, genre),
    updateGenre: (id, genre) => axios.put(`${BASE}/genres/${id}`, genre),
    deleteGenre: (id) => axios.delete(`${BASE}/genres/${id}`),

    // Activity Logs
    getLogs: (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return axios.get(`${BASE}/logs${params ? `?${params}` : ''}`);
    },

    // Publishers
    getPublishers: () => axios.get(`${BASE}/publishers`),
    searchPublishers: (query) => axios.get(`${BASE}/publishers/search?query=${query}`),
    getPublisherBooks: (id) => axios.get(`${BASE}/publishers/${id}/books`),
    addPublisher: (pub) => axios.post(`${BASE}/publishers`, pub),
    updatePublisher: (id, pub) => axios.put(`${BASE}/publishers/${id}`, pub),
    deletePublisher: (id) => axios.delete(`${BASE}/publishers/${id}`),
    undoDeletePublisher: () => axios.post(`${BASE}/publishers/undo-delete`),

    // Reports
    getReportsSummary: () => axios.get(`${BASE}/reports/summary`),
};
