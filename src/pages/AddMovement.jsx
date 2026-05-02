import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMovement } from '../api/movements';
import MovementForm from '../components/MovementForm';
import Button from '../components/Button';

const AddMovementPage = () => {
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData) => {
        setError(null);
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            await createMovement(formData);
            navigate('/movements');
        } catch (err) {
            if (err.status === 400 && err.data?.error?.details) {
                const errors = {};
                err.data.error.details.forEach(({ path, message }) => {
                    errors[path[0]] = message;
                });
                setFieldErrors(errors);
            } else {
                setError(err.data?.error?.message || err.message || 'Error al crear el movimiento');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="edit-project-page">
            <div className="page-header">
                <h1>Nuevo movimiento</h1>
                <div className="page-header-buttons">
                    <Button
                        layout="icon-text-button"
                        icon="arrow_back"
                        label="Volver"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                    />
                </div>
            </div>

            <MovementForm
                onSubmit={handleSubmit}
                onCancel={() => navigate(-1)}
                isSubmitting={isSubmitting}
                fieldErrors={fieldErrors}
                error={error}
            />
        </div>
    );
};

export default AddMovementPage;