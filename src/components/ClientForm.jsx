import React, { useState, useEffect } from 'react';
import { createClient } from '../api/clients';
import Input from './Input';
import Button from './Button';

const emptyPhone = () => ({ label: '', number: '' });

const ClientForm = ({ initialData = null, onSuccess, onCancel, onSubmit, submitLabel = 'Crear cliente', submitIcon = 'person_add' }) => {

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        surname: initialData?.surname || '',
        email: initialData?.email || '',
        nif: initialData?.nif || '',
        notes: initialData?.notes || '',
    });

    const [phones, setPhones] = useState(
        initialData?.phones?.map(p => ({ label: p.label || '', number: p.number || '' })) || [emptyPhone()]
    );

    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                surname: initialData.surname || '',
                email: initialData.email || '',
                nif: initialData.nif || '',
                notes: initialData.notes || '',
            });
            setPhones(
                initialData.phones?.map(p => ({ label: p.label || '', number: p.number || '' })) || [emptyPhone()]
            );
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddPhone = () => setPhones([...phones, emptyPhone()]);

    const handlePhoneChange = (index, field, value) => {
        setPhones(phones.map((phone, i) => i === index ? { ...phone, [field]: value } : phone));
    };

    const handleRemovePhone = (index) => {
        setPhones(phones.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsSubmitting(true);

        const payload = {
            ...formData,
            phones: phones.filter(p => p.number.trim() !== ''),
        };

        try {
            if (onSubmit) {
                await onSubmit(payload);
                onSuccess?.();
            } else {
                const response = await createClient(payload);
                onSuccess?.(response.data);
            }
        } catch (err) {
            if (err.status === 400 && err.data?.error?.details) {
                const errors = {};
                err.data.error.details.forEach(({ path, message }) => {
                    if (path.length === 1) {
                        errors[path[0]] = message;
                    } else if (path[0] === 'phones') {
                        errors[`phone_${path[1]}_${path[2]}`] = message;
                    }
                });
                setFieldErrors(errors);
            } else {
                setError(err.data?.error?.message || err.message || 'Error al guardar el cliente');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-client-form">

            {error && (
                <div className="form-error-banner">
                    <span className="material-symbols-rounded">error</span>
                    {error}
                </div>
            )}

            <div className="section">
                <h2 className="section-title">Datos personales</h2>

                <Input
                    name="name"
                    label="Nombre *"
                    icon="person"
                    type="text"
                    placeholder="Nombre del cliente"
                    value={formData.name}
                    onChange={handleChange}
                    error={fieldErrors.name}
                />
                <Input
                    name="surname"
                    label="Apellidos"
                    icon="person"
                    type="text"
                    placeholder="Apellidos"
                    value={formData.surname}
                    onChange={handleChange}
                    error={fieldErrors.surname}
                />
                <Input
                    name="email"
                    label="Email"
                    icon="mail"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={fieldErrors.email}
                />
                <Input
                    name="nif"
                    label="NIF / CIF"
                    icon="badge"
                    type="text"
                    placeholder="12345678A"
                    value={formData.nif}
                    onChange={handleChange}
                    error={fieldErrors.nif}
                />
            </div>

            <div className="section">
                <h2 className="section-title">Teléfonos</h2>

                {phones.map((phone, index) => (
                    <div key={index} className="phone-row">
                        <div className="phone-row-block">
                            <Input
                                label=""
                                icon="label"
                                type="text"
                                placeholder="Ej: móvil"
                                value={phone.label}
                                onChange={(e) => handlePhoneChange(index, 'label', e.target.value)}
                            />
                            <Input
                                label=""
                                icon="call"
                                type="tel"
                                placeholder="Número de teléfono"
                                value={phone.number}
                                onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                                error={fieldErrors[`phone_${index}_number`]}
                            />
                            {phones.length > 1 && (
                                <Button
                                    className="trash"
                                    layout="icon-button"
                                    icon="delete"
                                    variant="ghost"
                                    size="circle-md"
                                    type="button"
                                    onClick={() => handleRemovePhone(index)}
                                />
                            )}
                            <Button
                                layout="icon-text-button"
                                icon="add"
                                label="Añadir"
                                variant="accent"
                                size="md"
                                type="button"
                                onClick={handleAddPhone}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="section">
                <h2 className="section-title">Notas</h2>

                <div className={`custom-input-group ${fieldErrors.notes ? 'has-error' : ''}`}>
                    <div className="input-wrapper textarea-wrapper">
                        <textarea
                            name="notes"
                            className="custom-input custom-textarea"
                            placeholder="Observaciones sobre el cliente..."
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                    {fieldErrors.notes && (
                        <span className="error-message">{fieldErrors.notes}</span>
                    )}
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
                    icon={isSubmitting ? 'sync' : submitIcon}
                    label={isSubmitting ? 'Guardando...' : submitLabel}
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={isSubmitting}
                />
            </div>
        </form>
    );
};

export default ClientForm;