import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTenant } from '../api/tenant';
import Card from '../components/Card';
import Button from '../components/Button';

const TenantPage = () => {
    const navigate = useNavigate();

    const [tenant, setTenant] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const response = await getTenant();
                setTenant(response.data);
                if (response.data.logoUrl) setLogoUrl(response.data.logoUrl);
            } catch (err) {
                setError(err.data?.error?.message || err.message || 'Error al cargar los datos de la empresa');
            } finally {
                setLoading(false);
            }
        };

        fetchTenant();
    }, []);

    if (loading) return (
        <div className="page-loading">
            <span className="material-symbols-rounded spinning">sync</span>
            <p>Cargando empresa...</p>
        </div>
    );

    if (error) return (
        <div className="form-error-banner">
            <span className="material-symbols-rounded">error</span>
            {error}
        </div>
    );

    if (!tenant) return null;

    const fmt = (date) => new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    return (
        <div className="tenant-detail-page">
            <div className="page-header">
                <h1>Mi empresa</h1>
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
                        icon="edit"
                        label="Editar empresa"
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/tenant/edit')}
                    />
                </div>
            </div>

            {logoUrl ? (<div className="tenant-logo">
                <img className="logo" src={logoUrl} alt="Logo" />
            </div>) : ''}



            <div className="banner" style={{ background: tenant.primaryColor }}>
                <div className="banner-info">
                    <h2>{tenant.name}</h2>
                    <span className="subtitle">{tenant.nif || 'Sin NIF registrado'}</span>
                </div>
            </div>

            {tenant.description && (
                <Card
                    title='Descripción'
                    subtitle={tenant.description}
                    className='centered muted'
                />
            )}

            <div className="section list">
                <h2 className="section-title">Contacto</h2>
                {tenant.email && (
                    <Card
                        title="Email"
                        value={tenant.email}
                        badge={{ color: tenant.primaryColor || 'var(--neutral)', icon: 'mail' }}
                    />
                )}
                {tenant.phone1 && (
                    <Card
                        title="Teléfono principal"
                        value={tenant.phone1}
                        badge={{ color: tenant.primaryColor || 'var(--neutral)', icon: 'phone' }}
                    />
                )}
                {tenant.phone2 && (
                    <Card
                        title="Teléfono secundario"
                        value={tenant.phone2}
                        badge={{ color: tenant.primaryColor || 'var(--neutral)', icon: 'phone' }}
                    />
                )}
                {tenant.website && (
                    <Card
                        title="Sitio web"
                        value={tenant.website}
                        badge={{ color: tenant.primaryColor || 'var(--neutral)', icon: 'language' }}
                    />
                )}
                {tenant.address && (
                    <Card
                        title="Dirección"
                        value={tenant.address}
                        badge={{ color: tenant.primaryColor || 'var(--neutral)', icon: 'location_on' }}
                    />
                )}
                {!tenant.email && !tenant.phone1 && !tenant.address && (
                    <p className="form-empty-hint">Sin datos de contacto registrados.</p>
                )}
            </div>


            <div className="section list">
                <h2 className="section-title">Información del registro</h2>

                <Card
                    title="Fecha de registro"
                    value={fmt(tenant.createdAt)}
                    className='muted'
                />
            </div>

        </div>
    );
};

export default TenantPage;