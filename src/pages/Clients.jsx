import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllClients } from '../api/clients';
import Card from '../components/Card';
import Button from '../components/Button';
import { normalize } from '../utils/normalize';

const STATUS_CONFIG = {
    active: { status: 'success', color: 'var(--color-success)', icon: 'person' },
    inactive: { status: 'neutral', color: 'var(--neutral)', icon: 'person_off' },
    blocked: { status: 'danger', color: 'var(--color-danger)', icon: 'block' },
};

const getStatusConfig = (status) => STATUS_CONFIG[status] || { status: 'neutral', color: 'var(--neutral)', icon: 'person' };

const ClientsPage = () => {
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await getAllClients();
                setClients(response.data || []);
            } catch (err) {
                setError(err.data?.error?.message || err.message || 'Error al cargar los clientes');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const filtered = clients.filter(client => {
        const term = normalize(search);
        return (
            normalize(client.name).includes(term) ||
            normalize(client.surname).includes(term) ||
            normalize(client.email).includes(term) ||
            normalize(client.nif).includes(term)
        );
    });

    if (loading) return (
        <div className="page-loading">
            <span className="material-symbols-rounded spinning">sync</span>
            <p>Cargando clientes...</p>
        </div>
    );

    if (error) return (
        <div className="form-error-banner">
            <span className="material-symbols-rounded">error</span>
            {error}
        </div>
    );

    return (
        <div className="clients-page">

            <div className="page-header">
                <h1>Clientes</h1>
                <div className="page-header-buttons">
                    <Button
                        layout="icon-button"
                        icon="arrow_back"
                        label="Volver"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                    />
                    <Button
                        layout="icon-text-button"
                        icon="person_add"
                        label="Nuevo cliente"
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/add-client')}
                    />
                </div>

            </div>

            <div className="custom-input-group">
                <div className="input-wrapper">
                    <span className="material-symbols-rounded input-icon">search</span>
                    <input
                        type="text"
                        className="custom-input"
                        placeholder="Buscar por nombre, email o NIF..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="list">
                {filtered.length === 0 ? (
                    <div className="list-empty">
                        <span className="material-symbols-rounded">person_search</span>
                        <p>{search ? 'No hay clientes que coincidan con la búsqueda.' : 'Aún no hay clientes registrados.'}</p>
                    </div>
                ) : (
                    filtered.map(client => {
                        const config = getStatusConfig(client.status);
                        const fullName = [client.name, client.surname].filter(Boolean).join(' ');
                        return (

                            <Card
                                key={client.id}
                                title={fullName}
                                subtitle={[client.phones?.[0]?.number, client.email].filter(Boolean).join(' | ')}
                                value={client.nif || ''}
                                status={config.status}
                                badge={{ color: config.color, icon: config.icon }}
                                onClick={() => navigate(`/clients/${client.id}`)}
                            />
                        );
                    })
                )}
            </div>

        </div>
    );
};

export default ClientsPage;