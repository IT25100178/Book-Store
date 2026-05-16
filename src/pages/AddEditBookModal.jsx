import React, { useState, useEffect, useRef } from 'react';
import Validator from '../utils/Validator';
import { FiX, FiUploadCloud } from 'react-icons/fi';

const AddEditBookModal = ({ isOpen, book, onClose, onSave }) => {
    const emptyForm = { title: '', author: '', isbn: '', category: '', price: '', stockQuantity: '', description: '', coverImageUrl: '' };
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setForm(book ? { ...book } : emptyForm);
            setErrors({});
        }
    }, [isOpen, book]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

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
        const { valid, errors: ve } = Validator.validateBook(data);
        if (!valid) { setErrors(ve); return; }
        onSave(data);
    };

    const fields = [
        { name: 'title', label: 'Title *', type: 'text', full: false },
        { name: 'author', label: 'Author *', type: 'text', full: false },
        { name: 'isbn', label: 'ISBN *', type: 'text', full: false },
        { name: 'category', label: 'Category *', type: 'text', full: false },
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
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        step={field.type === 'number' ? '0.01' : undefined}
                                        className={`form-control ${errors[field.name] ? 'error' : ''}`}
                                    />
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
