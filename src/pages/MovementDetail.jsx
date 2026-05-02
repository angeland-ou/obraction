import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMovement, deleteMovement } from '../api/movements';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import DocumentItem from '../components/DocumentItem';

const MovementDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [movement, setMovement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteMovement(id);
            navigate('/movements');
        } catch (err) {
            setError(err.data?.error?.message || err.message || 'Error al eliminar el movimiento');
            setConfirmDelete(false);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return (
        <div className="page-loading">
            <span className="material-symbols-rounded spinning">sync</span>
            <p>Cargando movimiento...</p>
        </div>
    );

    if (error) return (
        <div className="form-error-banner">
            <span className="material-symbols-rounded">error</span>
            {error}
        </div>
    );

    if (!movement) return null;

    const isIncome = movement.type === 'income';
    const color = isIncome ? 'var(--color-success)' : 'var(--color-danger)';
    const icon = isIncome ? 'trending_up' : 'trending_down';
    const typeLabel = isIncome ? 'Ingreso' : 'Gasto';
    const status = isIncome ? 'success' : 'danger';

    const fmt = (n) => `${Number(n).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €`;
    const fecha = new Date(movement.movementDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div className="client-detail-page">

            <div className="page-header">
                <div className='page-header-title-block'>
                    <h1>Detalle del movimiento</h1>
                </div>

                <div className="page-header-buttons">
                    <Button
                        layout="icon-button"
                        icon="arrow_back"
                        variant="ghost"
                        size="circle-sm"
                        onClick={() => navigate(-1)}
                    />
                    <Button
                        layout="icon-text-button"
                        icon="edit"
                        label="Editar"
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/movements/${id}/edit`)}
                    />

                    <Button
                        layout="icon-text-button"
                        icon={isDeleting ? 'sync' : confirmDelete ? 'warning' : 'delete'}
                        label={isDeleting ? 'Eliminando...' : confirmDelete ? '¿Confirmar?' : 'Borrar'}
                        variant={confirmDelete ? 'danger' : 'ghost'}
                        size="sm"
                        onClick={() => setConfirmDelete(true)}
                        disabled={isDeleting}
                    />
                </div>
            </div>

            <div className="movement-data">
                <div className="color-block-type" style={{ background: color }}>
                    <span className="material-symbols-rounded">{icon}</span>
                    <span className='detail'>{typeLabel} <strong>{fecha}</strong></span>
                </div>
                <div>
                    <h2>{movement.concept || '(Sin concepto)'}</h2>
                </div>

                <div className="list">
                    <h3 className="">Importes</h3>

                    <Card
                        title={fmt(movement.total || movement.amount)}
                        value="Total con IVA"
                        status={status}
                        badge={{ color, icon: 'euro' }}
                    />
                    <Card
                        title="Importe base"
                        value={fmt(movement.amount)}
                        className="base-amount"
                    />
                    <Card
                        title={`IVA (${movement.iva}%)`}
                        value={fmt(movement.ivaAmount || 0)}
                        className="iva-amount"
                    />
                </div>

                <div className="section">
                    <h2 className="section-title">Obra asociada</h2>
                    {movement.project ? (
                        <Card
                            title={movement.project.name}
                            onClick={() => navigate(`/projects/${movement.projectId}`)}
                        />
                    ) : (
                        <p className="form-empty-hint">Movimiento general de empresa (sin obra asignada).</p>
                    )}
                </div>

                {movement.notes && (
                    <div className="section">
                        <h2 className="section-title">Notas</h2>
                        <div className="client-notes">
                            <p>{movement.notes}</p>
                        </div>
                    </div>
                )}

                <div className="section">
                    <h2 className="section-title">Documento adjunto</h2>
                    {movement.documents && movement.documents.length > 0 ? (
                        movement.documents.map(doc => (
                            <DocumentItem key={doc.id} document={doc} />
                        ))
                    ) : (
                        <p className="form-empty-hint">Sin documento adjunto.</p>
                    )}
                </div>

                <div className="section">
                    <Card
                        title="Fecha de registro"
                        value={new Date(movement.createdAt).toLocaleDateString('es-ES')}
                        className='muted'
                    />
                </div>

            </div>

            <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Eliminar movimiento">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <p style={{ margin: 0 }}>
                        ¿Estás seguro de que quieres eliminar el movimiento <strong>{movement.concept || '(Sin concepto)'}</strong>?
                        {movement.documents?.length > 0 && ' También se eliminará el documento adjunto.'} Esta acción no se puede deshacer.
                    </p>
                    <div className="form-actions">
                        <Button
                            layout="text-button"
                            label="Cancelar"
                            variant="ghost"
                            size="md"
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                        />
                        <Button
                            layout="icon-text-button"
                            icon={isDeleting ? 'sync' : 'delete'}
                            label={isDeleting ? 'Eliminando...' : 'Eliminar'}
                            variant="danger"
                            size="md"
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MovementDetail;