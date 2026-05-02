import React, { useState, useEffect } from 'react';
import { getAllProjects } from '../api/projects';
import Input from './Input';
import Button from './Button';

const TIPOS = [
    { value: 'income', label: 'Ingreso' },
    { value: 'expense', label: 'Gasto' },
];

const IVA_OPCIONES = [
    { value: 0, label: 'Sin IVA (0%)' },
    { value: 4, label: '4%' },
    { value: 10, label: '10%' },
    { value: 21, label: '21%' },
];

const MovementForm = ({
    initialData = {},
    onSubmit,
    onCancel,
    isSubmitting = false,
    fieldErrors = {},
    error = null,
    existingDocument = null,
}) => {
    
    const [formData, setFormData] = useState({
        type: initialData.type || 'expense',
        amount: initialData.amount || '',
        iva: initialData.iva !== undefined ? String(initialData.iva) : '0',
        concept: initialData.concept || '',
        notes: initialData.notes || '',
        movementDate: initialData.movementDate ? initialData.movementDate.split('T')[0] : new Date().toISOString().split('T')[0],
        projectId: initialData.projectId || '',
    });

    const [file, setFile] = useState(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getAllProjects();
                setProjects(response.data || []);
            } catch {
                // no bloqueamos el formulario si falla
            }
        };
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
            if (val !== '' && val !== null && val !== undefined) {
                fd.append(key, val);
            }
        });
        if (!fd.has('amount')) fd.append('amount', '');
        if (file) fd.append('file', file);
        onSubmit(fd);
    };

    const isIncome = formData.type === 'income';

    return (
        <form onSubmit={handleSubmit} className="add-obra-form">
            {error && (
                <div className="form-error-banner">
                    <span className="material-symbols-rounded">error</span>
                    {error}
                </div>
            )}

            <div className="section">
                <h2 className="section-title">Tipo de movimiento</h2>

                <div className="movement-type-toggle">
                    {TIPOS.map(op => (
                        <button
                            key={op.value}
                            type="button"
                            className={`movement-type-btn ${formData.type === op.value ? `active-${op.value}` : ''}`}
                            onClick={() => setFormData({ ...formData, type: op.value })}
                        >
                            <span className="material-symbols-rounded">
                                {op.value === 'income' ? 'trending_up' : 'trending_down'}
                            </span>
                            {op.label}
                        </button>
                    ))}
                </div>
                {fieldErrors.type && <span className="error-message">{fieldErrors.type}</span>}
            </div>

            <div className="section">
                <h2 className="section-title">Importe</h2>

                <Input
                    name="amount"
                    label={`Importe (€) *`}
                    icon={isIncome ? 'add_circle' : 'remove_circle'}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    error={fieldErrors.amount}
                />

                <div className={`custom-input-group ${fieldErrors.iva ? 'has-error' : ''}`}>
                    <label className="input-label">IVA</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-rounded input-icon">percent</span>
                        <select
                            name="iva"
                            className="custom-input custom-select"
                            value={formData.iva}
                            onChange={handleChange}
                        >
                            {IVA_OPCIONES.map(op => (
                                <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                        </select>
                    </div>
                    {fieldErrors.iva && <span className="error-message">{fieldErrors.iva}</span>}
                </div>

                <Input
                    name="movementDate"
                    label="Fecha"
                    icon="calendar_today"
                    type="date"
                    value={formData.movementDate}
                    onChange={handleChange}
                    error={fieldErrors.movementDate}
                />
            </div>

            <div className="section">
                <h2 className="section-title">Descripción</h2>

                <Input
                    name="concept"
                    label="Concepto"
                    icon="label"
                    type="text"
                    placeholder="Ej: Factura materiales"
                    value={formData.concept}
                    onChange={handleChange}
                    error={fieldErrors.concept}
                />

                <div className={`custom-input-group ${fieldErrors.notes ? 'has-error' : ''}`}>
                    <label className="input-label">Notas</label>
                    <div className="input-wrapper textarea-wrapper">
                        <span className="material-symbols-rounded input-icon">description</span>
                        <textarea
                            name="notes"
                            className="custom-input custom-textarea"
                            placeholder="Observaciones adicionales..."
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                    {fieldErrors.notes && <span className="error-message">{fieldErrors.notes}</span>}
                </div>
            </div>

            <div className="section">
                <h2 className="section-title">Obra asociada</h2>
                <p className="form-empty-hint">
                    Si no seleccionas una obra, el movimiento se registrará como gasto o ingreso general de la empresa.
                </p>

                <div className={`custom-input-group ${fieldErrors.projectId ? 'has-error' : ''}`}>
                    <label className="input-label">Obra (opcional)</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-rounded input-icon">apartment</span>
                        <select
                            name="projectId"
                            className="custom-input custom-select"
                            value={formData.projectId}
                            onChange={handleChange}
                        >
                            <option value="">— Sin obra asignada (gasto/ingreso general) —</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    {fieldErrors.projectId && <span className="error-message">{fieldErrors.projectId}</span>}
                </div>
            </div>

            <div className="section">
                <h2 className="section-title">Documento adjunto</h2>

                <div className="custom-input-group">
                    {existingDocument && !file && (
                        <div className="form-empty-hint" style={{ marginBottom: '0.75rem' }}>
                            Ya hay un documento adjunto. Si subes uno nuevo lo reemplazará.
                        </div>
                    )}

                    <div className="file-input-wrapper">
                        <label className="file-input-label">
                            <span className="material-symbols-rounded">attach_file</span>
                            <span>{file ? file.name : 'Seleccionar PDF o imagen...'}</span>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className="file-input-hidden"
                            />
                        </label>
                        {file && (
                            <button
                                type="button"
                                className="client-selected-clear"
                                onClick={() => setFile(null)}
                            >
                                <span className="material-symbols-rounded">close</span>
                            </button>
                        )}
                    </div>
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

export default MovementForm;