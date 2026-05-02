import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMovement, updateMovement } from '../api/movements';
import MovementForm from '../components/MovementForm';
import Button from '../components/Button';
import { deleteDocument } from '../api/documents';
import DocumentItem from '../components/DocumentItem';


const EditMovementPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [movement, setMovement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeletingDoc, setIsDeletingDoc] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await getMovement(id);
                setMovement(response.data);
            } catch (err) {
                setError(err.data?.error?.message || err.message || 'Error al cargar el movimiento');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleSubmit = async (data) => {
        setError(null);
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            await updateMovement(id, data);
            navigate(`/movements/${id}`);
        } catch (err) {
            if (err.status === 400 && err.data?.error?.details) {
                const errors = {};
                err.data.error.details.forEach(({ path, message }) => {
                    errors[path[0]] = message;
                });
                setFieldErrors(errors);
            } else {
                typeof err.data?.error === 'string'
                    ? err.data.error
                    : err.message || 'Error al actualizar el movimiento'
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDocument = async () => {
        const doc = movement.documents?.[0];
        if (!doc) return;
        setIsDeletingDoc(true);
        try {
            await deleteDocument(doc.id);
            setMovement(prev => ({ ...prev, documents: [] }));
        } catch (err) {
            setError(err.data?.error?.message || err.message || 'Error al eliminar el documento');
        } finally {
            setIsDeletingDoc(false);
        }
    };

    if (loading) return (
        <div className="page-loading">
            <span className="material-symbols-rounded spinning">sync</span>
            <p>Cargando movimiento...</p>
        </div>
    );

    return (
        <div className="edit-project-page">
            <div className="page-header">
                <h1>Editar movimiento</h1>
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

            {movement.documents?.[0] && (
                <div className="section">
                    <h2 className="section-title">Documento adjunto actual</h2>
                    <div className='attached-file' style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <DocumentItem document={movement.documents[0]} />
                        <Button
                            layout="icon-button"
                            icon="close"
                            variant="danger"
                            type="button"
                            onClick={handleDeleteDocument}
                            disabled={isDeletingDoc}
                        />
                    </div>
                </div>
            )}

            {movement && (
                <MovementForm
                    initialData={{
                        ...movement,
                        amount: String(movement.amount),
                        iva: String(movement.iva),
                        movementDate: movement.movementDate,
                        projectId: movement.projectId || '',
                    }}
                    existingDocument={movement.documents?.[0] || null}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(-1)}
                    isSubmitting={isSubmitting}
                    fieldErrors={fieldErrors}
                    error={error}
                />
            )}
        </div>
    );
};

export default EditMovementPage;