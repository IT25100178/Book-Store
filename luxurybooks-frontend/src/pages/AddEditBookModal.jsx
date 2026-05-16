import React, { useState, useEffect, useRef } from 'react';
import Validator from '../utils/Validator';
import { FiX, FiUploadCloud } from 'react-icons/fi';
import { api } from '../services/api';

const AddEditBookModal = ({ isOpen, book, onClose, onSave }) => {
    const emptyForm = { title: '', author: '', authorId: '', isbn: '', category: '', genreId: '', publisherId: '', price: '', stockQuantity: '', description: '', coverImageUrl: '' };
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [genres, setGenres] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setForm(book ? { ...book } : emptyForm);
            setErrors({});
            // Fetch dependencies
            Promise.all([
                api.getGenres(),
                api.getAuthors(),
                api.getPublishers()
            ]).then(([genresRes, authorsRes, publishersRes]) => {
                setGenres(genresRes.data);
                setAuthors(authorsRes.data);
                setPublishers(publishersRes.data);
            }).catch(err => console.error("Failed to fetch dependencies", err));
        }
    }, [isOpen, book]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Auto-update ID when name is selected for name-based fields (legacy support)
        let updates = { [name]: value };
        if (name === 'category') {
            const selectedGenre = genres.find(g => g.name === value);
            if (selectedGenre) updates.genreId = selectedGenre.id;
        } else if (name === 'author') {
            const selectedAuthor = authors.find(a => a.name === value);
            if (selectedAuthor) updates.authorId = selectedAuthor.id;
        }

        setForm(prev => ({ ...prev, ...updates }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleIdChange = (e) => {
        const { name, value } = e.target;
        let updates = { [name]: value };
        
        // Auto-update name when ID is selected
        if (name === 'genreId') {
            const selectedGenre = genres.find(g => g.id === value);
            if (selectedGenre) updates.category = selectedGenre.name;
        } else if (name === 'authorId') {
            const selectedAuthor = authors.find(a => a.id === value);
            if (selectedAuthor) updates.author = selectedAuthor.name;
        }

        setForm(prev => ({ ...prev, ...updates }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, coverImageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...form, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity, 10) };
        // Basic validation
        if (!data.title || !data.authorId || !data.genreId || !data.publisherId) {
            alert("Please fill in all required fields (Title, Author, Genre, Publisher)");
            return;
        }
        onSave(data);
    };

    const fields = [
        { name: 'title', label: 'Title *', type: 'text', full: true },
        { name: 'authorId', label: 'Author *', type: 'select', options: authors, full: false },
        { name: 'genreId', label: 'Genre *', type: 'select', options: genres, full: false },
        { name: 'publisherId', label: 'Publisher *', type: 'select', options: publishers, full: false },
        { name: 'isbn', label: 'ISBN *', type: 'text', full: false },
        { name: 'price', label: 'Price ($) *', type: 'number', full: false },
        { name: 'stockQuantity', label: 'Stock Quantity *', type: 'number', full: false },
    ];

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">{book ? 'Edit Book' : 'Add New Book'}</span>
                    <button className="modal-close" onClick={onClose}><FiX /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-grid">
                            {fields.map(field => (
                                <div key={field.name} className={`form-group ${field.full ? 'full' : ''}`}>
                                    <label>{field.label}</label>
                                    {field.type === 'select' ? (
                                         <select
                                             name={field.name}
                                             value={form[field.name]}
                                             onChange={field.name.endsWith('Id') ? handleIdChange : handleChange}
                                             className={`form-control ${errors[field.name] ? 'error' : ''}`}
                                         >
                                             <option value="">Select {field.label.replace(' *', '')}</option>
                                             {field.options && field.options.map(opt => (
                                                 <option key={opt.id} value={opt.id}>{opt.name}</option>
                                             ))}
                                         </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            step={field.type === 'number' ? '0.01' : undefined}
                                            className={`form-control ${errors[field.name] ? 'error' : ''}`}
                                        />
                                    )}
                                    {errors[field.name] && <span className="error-msg">{errors[field.name]}</span>}
                                </div>
                            ))}
                            
                            <div className="form-group full">
                                <label>Cover Image</label>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div 
                                        style={{ width: '80px', height: '110px', background: 'var(--bg-hover)', border: '1px solid #CBD5E1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        {form.coverImageUrl ? (
                                            <img src={form.coverImageUrl} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ color: 'var(--text-light)', fontSize: '24px' }}> <FiUploadCloud /> </span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <input 
                                            type="text" 
                                            name="coverImageUrl" 
                                            value={form.coverImageUrl} 
                                            onChange={handleChange} 
                                            placeholder="Paste image URL here or click thumbnail to upload file"
                                            className="form-control" 
                                            style={{ marginBottom: '8px' }}
                                        />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            ref={fileInputRef} 
                                            style={{ display: 'none' }} 
                                            onChange={handleFileChange}
                                        />
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            Supports direct URLs or uploading local images (converted to Base64).
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group full">
                                <label>Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows="3" />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Book</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditBookModal;
