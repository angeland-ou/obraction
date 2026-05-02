import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

const ESTADOS = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'done', label: 'Completada' },
];

const TaskForm = ({ initialData = {}, onSubmit, onCancel, isSubmitting = false, fieldErrors = {}, error = null }) => {

    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="add-obra-form">

            {error && (
                <div className="form-error-banner">
                    <span className="material-symbols-rounded">error</span>
                    {error}
                </div>
            )}

            <div className="section">
                <Input
                    name="title"
                    label="Título *"
                    icon="task_alt"
                    type="text"
                    placeholder="Ej: Replanteo de estructura"
                    value={formData.title}
                    onChange={handleChange}
                    error={fieldErrors.title}
                />

                <div className={`custom-input-group ${fieldErrors.status ? 'has-error' : ''}`}>
                    <label className="input-label">Estado</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-rounded input-icon">flag</span>
                        <select
                            name="status"
                            className="custom-input custom-select"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            {ESTADOS.map(op => (
                                <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                        </select>
                    </div>
                    {fieldErrors.status && <span className="error-message">{fieldErrors.status}</span>}
                </div>

                <Input
                    name="dueDate"
                    label="Fecha límite"
                    icon="calendar_today"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    error={fieldErrors.dueDate}
                />

                <div className={`custom-input-group ${fieldErrors.description ? 'has-error' : ''}`}>
                    <label className="input-label">Descripción</label>
                    <div className="input-wrapper textarea-wrapper">
                        <span className="material-symbols-rounded input-icon">description</span>
                        <textarea
                            name="description"
                            className="custom-input custom-textarea"
                            placeholder="Detalles de la tarea..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                    {fieldErrors.description && <span className="error-message">{fieldErrors.description}</span>}
                </div>
            </div>

            <div className="form-actions">
                <Button
                    layout="text-button"
                    label="Cancelar"
                    variant="ghost"
                    size="md"
                    type="button"
                    onClick={onCancel}
                />
                <Button
                    layout="icon-text-button"
                    icon={isSubmitting ? 'sync' : 'save'}
                    label={isSubmitting ? 'Guardando...' : 'Guardar'}
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={isSubmitting}
                />
            </div>
        </form>
    );
};

export default TaskForm;