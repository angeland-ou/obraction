import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { getTenant, updateTenant, uploadTenantLogo, deleteTenantLogo } from '../api/tenant';
import { useTenant } from '../context/TenantContext'; // importar

const EditTenantPage = () => {
    const navigate = useNavigate();
    const { updateLogo, updateColor } = useTenant();

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        nif: '',
        email: '',
        address: '',
        website: '',
        phone1: '',
        phone2: '',
        primaryColor: '',
        description: '',
    });

    const [logoUrl, setLogoUrl] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoSuccess, setLogoSuccess] = useState(false);

    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const response = await getTenant();
                const t = response.data;

                setFormData({
                    name: t.name || '',
                    slug: t.slug || '',
                    nif: t.nif || '',
                    email: t.email || '',
                    address: t.address || '',
                    website: t.website || '',
                    phone1: t.phone1 || '',
                    phone2: t.phone2 || '',
                    primaryColor: t.primaryColor || '',
                    description: t.description || '',
                });

                if (t.logoUrl) setLogoUrl(t.logoUrl);

            } catch (err) {
                setError(err.data?.error?.message || err.message || 'Error al cargar los datos de la empresa');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTenant();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowed.includes(file.type)) {
            setError('El logotipo debe ser un archivo PNG o JPG');
            return;
        }

        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
        setLogoSuccess(false);
        setError(null);
    };

    const handleLogoUpload = async () => {
        if (!logoFile) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const form = new FormData();
            form.append('logo', logoFile);
            await uploadTenantLogo(form);
            updateLogo(logoPreview);
            setLogoSuccess(true);
            setLogoFile(null);
        } catch (err) {
            setError(err.data?.error?.message || err.message || 'Error al subir el logotipo');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            await updateTenant(formData);
            updateColor(formData.primaryColor);
            navigate(-1);
        } catch (err) {
            if (err.status === 400 && err.data?.error?.details) {
                const errors = {};
                err.data.error.details.forEach(({ path, message }) => {
                    errors[path[0]] = message;
                });
                setFieldErrors(errors);
            } else {
                setError(err.data?.error?.message || err.message || 'Error al actualizar los datos de la empresa');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveLogo = async () => {
        try {
            await deleteTenantLogo();
            setLogoPreview(null);
            setLogoFile(null);
            setLogoUrl(null);
        } catch (err) {
            setError(err.data?.error?.message || err.message || 'Error al eliminar el logotipo');
        }
    };

    const DEFAULT_COLOR = '#2563eb';
    const handleResetColor = async () => {
        try {
            await updateTenant({ ...formData, primaryColor: DEFAULT_COLOR });
            setFormData(prev => ({ ...prev, primaryColor: DEFAULT_COLOR }));
            updateColor(DEFAULT_COLOR);
        } catch (err) {
            setError(err.data?.error?.message || err.message || 'Error al restaurar el color');
        }
    };

    if (isLoading) {
        return (
            <div className="edit-tenant-page">
                <div className="page-loading">
                    <span className="material-symbols-rounded spinning">sync</span>
                    <p>Cargando empresa...</p>
                </div>
            </div>
        );
    }

    const logoSrc = logoPreview || logoUrl;

    return (
        <div className="edit-tenant-page">
            <div className="page-header">
                <h1>Editar empresa</h1>
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

            <form onSubmit={handleSubmit} className="add-obra-form">
                {error && (
                    <div className="form-error-banner">
                        <span className="material-symbols-rounded">error</span>
                        {error}
                    </div>
                )}

                <div className="section">
                    <h2 className="section-title">Logotipo</h2>
                    <div className="logo-upload-area">
                        {logoSrc && (
                            <div className="logo-preview">
                                <img src={logoSrc} alt="Logo de la empresa" />
                            </div>
                        )}
                        <div className="logo-upload-actions">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg"
                                style={{ display: 'none' }}
                                onChange={handleLogoChange}
                            />
                            <Button
                                layout="icon-text-button"
                                icon="upload"
                                label="Seleccionar imagen"
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                            />
                            {logoFile && (
                                <Button
                                    layout="icon-text-button"
                                    icon={isSubmitting ? 'sync' : 'cloud_upload'}
                                    label={isSubmitting ? 'Subiendo...' : 'Aceptar logotipo'}
                                    variant="primary"
                                    size="sm"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleLogoUpload}
                                />
                            )}
                            {logoSuccess && (
                                <span className="logo-success-msg">
                                    Logotipo actualizado
                                </span>
                            )}
                            {(logoUrl || logoPreview) && !logoFile && (
                                <Button
                                    layout="icon-button"
                                    icon="delete"
                                    label="Quitar logo"
                                    variant="danger"
                                    size="circle-sm"
                                    type="button"
                                    onClick={handleRemoveLogo}
                                />
                            )}
                        </div>
                        <p className="form-empty-hint">Formatos aceptados: PNG o JPG · Máx. 2 MB</p>
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">Información general</h2>
                    <Input
                        name="name"
                        label="Nombre de la empresa"
                        icon="business"
                        type="text"
                        placeholder="Ej: Construcciones García S.L."
                        value={formData.name}
                        onChange={handleChange}
                        error={fieldErrors.name}
                    />
                    <Input
                        name="nif"
                        label="NIF / CIF"
                        icon="badge"
                        type="text"
                        placeholder="Ej: B12345678"
                        value={formData.nif}
                        onChange={handleChange}
                        error={fieldErrors.nif}
                    />

                    <Input
                        name="slug"
                        label="Identificador (slug)"
                        icon="tag"
                        type="text"
                        placeholder="Ej: construcciones-garcia"
                        value={formData.slug}
                        onChange={handleChange}
                        error={fieldErrors.slug}
                    />

                    <Input
                        name="primaryColor"
                        label="Color corporativo"
                        icon="palette"
                        type="color"
                        value={formData.primaryColor || '#000000'}
                        onChange={handleChange}
                        error={fieldErrors.primaryColor}
                    />
                    {formData.primaryColor && (
                        <Button
                            layout="icon-text-button"
                            icon="restart_alt"
                            label="Restaurar color original"
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={handleResetColor}
                        />
                    )}
                </div>

                <div className="section">
                    <h2 className="section-title">Contacto</h2>
                    <Input
                        name="email"
                        label="Email"
                        icon="mail"
                        type="email"
                        placeholder="empresa@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={fieldErrors.email}
                    />
                    <Input
                        name="phone1"
                        label="Teléfono principal"
                        icon="phone"
                        type="tel"
                        placeholder="Ej: 600 000 000"
                        value={formData.phone1}
                        onChange={handleChange}
                        error={fieldErrors.phone1}
                    />
                    <Input
                        name="phone2"
                        label="Teléfono secundario"
                        icon="phone"
                        type="tel"
                        placeholder="Ej: 912 000 000"
                        value={formData.phone2}
                        onChange={handleChange}
                        error={fieldErrors.phone2}
                    />
                    <Input
                        name="website"
                        label="Sitio web"
                        icon="language"
                        type="url"
                        placeholder="https://www.ejemplo.com"
                        value={formData.website}
                        onChange={handleChange}
                        error={fieldErrors.website}
                    />
                    <Input
                        name="address"
                        label="Dirección"
                        icon="location_on"
                        type="text"
                        placeholder="Calle, número, ciudad..."
                        value={formData.address}
                        onChange={handleChange}
                        error={fieldErrors.address}
                    />
                </div>

                <div className="section">
                    <h2 className="section-title">Descripción</h2>
                    <div className={`custom-input-group ${fieldErrors.description ? 'has-error' : ''}`}>
                        <label className="input-label">Descripción</label>
                        <div className="input-wrapper textarea-wrapper">
                            <span className="material-symbols-rounded input-icon">description</span>
                            <textarea
                                name="description"
                                className="custom-input custom-textarea"
                                placeholder="Describe brevemente tu empresa..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>
                        {fieldErrors.description && (
                            <span className="error-message">{fieldErrors.description}</span>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <Button
                        layout="text-button"
                        label="Cancelar"
                        variant="ghost"
                        size="md"
                        onClick={() => navigate(-1)}
                        type="button"
                    />
                    <Button
                        layout="icon-text-button"
                        icon={isSubmitting ? 'sync' : 'save'}
                        label={isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                        variant="primary"
                        size="md"
                        type="submit"
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
};

export default EditTenantPage;