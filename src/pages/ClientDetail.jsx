import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClient, deleteClient } from '../api/clients';
import Button from '../components/Button';
import Card from '../components/Card';

const ClientDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await getClient(id);
                setClient(response.data);
            } catch (err) {
                setError(err.data?.error?.message || err.message || 'Error al cargar el cliente');
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [id]);

    const handleDelete = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        setIsDeleting(true);
        try {
            await deleteClient(id);
            navigate('/clients');
        } catch (err) {
            setError(err.data?.error?.message || err.message || 'Error al eliminar el cliente');
            setIsDeleting(false);
            setConfirmDelete(false);
        }
    };

    if (loading) return (
        <div className="page-loading">
            <span className="material-symbols-rounded spinning">sync</span>
            <p>Cargando cliente...</p>
        </div>
    );

    if (error) return (
        <div className="form-error-banner">
            <span className="material-symbols-rounded">error</span>
            {error}
        </div>
    );

    if (!client) return null;

    const fullName = [client.name, client.surname].filter(Boolean).join(' ');

    return (
        <div className="client-detail-page">
            {/* Header */}
            <div className="page-header">
                <h1>{fullName}</h1>
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
                        onClick={() => navigate(`/clients/${id}/edit`)}
                    />
                    <Button
                        layout="icon-text-button"
                        icon={isDeleting ? 'sync' : confirmDelete ? 'warning' : 'delete'}
                        label={isDeleting ? 'Eliminando...' : confirmDelete ? '¿Confirmar?' : 'Borrar'}
                        variant={confirmDelete ? 'danger' : 'ghost'}
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    />
                </div>
            </div>

            <div className="list">

                {client.phones && client.phones.length > 0 && (
                    client.phones.map((phone, index) => (
                        <Card
                            key={index}
                            badge={{ color: 'var(--neutral)', icon: 'call' }}
                            title={phone.number}
                            subtitle={phone.label || 'teléfono'}
                            onClick={() => window.location.href = `tel:${phone.number.replace(/[\s\-().+]/g, '')}`}
                        />
                    ))
                )}

                {client.nif && (
                    <Card
                        title={client.nif}
                        value="NIF / CIF"
                        className='muted'
                    />
                )}

                {client.email ? (
                    <Card
                        title={client.email}
                        onClick={() => window.location.href = `mailto:${client.email.trim()}`}
                        className='centered'
                    />
                ) : (
                    <p className="form-empty-hint">Sin email registrado.</p>
                )}


                {client.notes && (
                    <Card
                        title='Nota'
                        subtitle={client.notes}
                        className='centered'
                    />
                )}
            </div>

        </div>
    );
};

export default ClientDetailPage;