import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClient, updateClient } from '../api/clients';
import ClientForm from '../components/ClientForm';
import Button from '../components/Button';

const EditClientPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [initialData, setInitialData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await getClient(id);
                setInitialData(response.data);
            } catch (err) {
                setError(err.data?.error?.message || err.message || 'Error al cargar el cliente');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClient();
    }, [id]);

    const handleUpdate = async (formData) => {
        await updateClient(id, formData);
        navigate(`/clients/${id}`);
    };

    if (isLoading) return (
        <div className="page-loading">
            <span className="material-symbols-rounded spinning">sync</span>
            <p>Cargando cliente...</p>
        </div>
    );

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="edit-client-page">
            <div className="page-header">
                <h1>Editar cliente</h1>
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

            <ClientForm
                initialData={initialData}
                onSuccess={() => navigate(`/clients/${id}`)}
                onCancel={() => navigate(-1)}
                onSubmit={handleUpdate}
                submitLabel="Guardar cambios"
                submitIcon="save"
            />
        </div>
    );
};

export default EditClientPage;