import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, updateProject } from '../api/projects';
import Input from '../components/Input';
import Button from '../components/Button';
import { getAllClients } from '../api/clients';
import Modal from '../components/Modal';
import ClientForm from '../components/ClientForm';
import { normalize } from '../utils/normalize';

const ESTADOS = [
    { value: '', label: 'Selecciona un estado' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En ejecución' },
    { value: 'blocked', label: 'Pausada' },
    { value: 'done', label: 'Finalizada' },
];

const EditProjectPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        status: '',
        address: '',
        startDate: '',
        notes: '',
    });

    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedClient, setSelectedClient] = useState(null);
    const [clientSearch, setClientSearch] = useState('');
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showClientModal, setShowClientModal] = useState(false);
    const dropdownRef = useRef(null);

    // cargamos los datos del proyecto
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProjectById(id);
                const p = response.data;

                setFormData({
                    name: p.name || '',
                    status: p.status || '',
                    address: p.address || '',
                    // formateamos la fecha YYYY-MM-DD para el input type="date"
                    startDate: p.startDate ? p.startDate.split('T')[0] : '',
                    notes: p.notes || '',
                });

                if (p.client) setSelectedClient(p.client);

            } catch (err) {
                setError(err.data?.error?.message || err.message || 'Error al cargar la obra');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await getAllClients();
                setClients(response.data || []);
            } catch {
                // si falla no bloqueamos el formulario
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        if (clientSearch.trim() === '') {
            setFilteredClients([]);
            setShowDropdown(false);
            return;
        }
        const term = normalize(clientSearch);
        const matches = clients.filter(c => {
            const fullName = normalize([c.name, c.surname].filter(Boolean).join(' '));
            return fullName.includes(term) || normalize(c.email).includes(term);
        });
        setFilteredClients(matches);
        setShowDropdown(true);
    }, [clientSearch, clients]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setClientSearch('');
        setShowDropdown(false);
    };

    const handleClearClient = () => {
        setSelectedClient(null);
        setClientSearch('');
    };

    const handleClientCreated = (newClient) => {
        setClients(prev => [...prev, newClient]);
        setSelectedClient(newClient);
        setShowClientModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            await updateProject(id, {
                ...formData,
                ...(selectedClient?.id && { clientId: selectedClient.id }),
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null
            });
            navigate('/projects');
        } catch (err) {
            if (err.status === 400 && err.data?.error?.details) {
                const errors = {};
                err.data.error.details.forEach(({ path, message }) => {
                    errors[path[0]] = message;
                });
                setFieldErrors(errors);
            } else {
                setError(err.data?.error?.message || err.message || 'Error al actualizar la obra');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="edit-project-page">
                <div className="page-loading">
                    <span className="material-symbols-rounded spinning">sync</span>
                    <p>Cargando obra...</p>
                </div>
            </div>
        );
    }

    return (

        <div className="edit-project-page">
            <div className="page-header">
                <h1>Editar obra</h1>
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
                    <h2 className="section-title">Información general</h2>

                    <Input
                        name="name"
                        label="Nombre de la obra"
                        icon="apartment"
                        type="text"
                        placeholder="Ej: Edificio Residencial Las Flores"
                        value={formData.name}
                        onChange={handleChange}
                        error={fieldErrors.name}
                    />

                    <div className={`custom-input-group ${fieldErrors.status ? 'has-error' : ''}`}>
                        <label className="input-label">Estado</label>
                        <div className="input-wrapper">
                            <span className="material-symbols-rounded input-icon">flag</span>
                            <select
                                name="status"
                                className="custom-input custom-select"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                {ESTADOS.map((op) => (
                                    <option key={op.value} value={op.value}>
                                        {op.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {fieldErrors.status && (
                            <span className="error-message">{fieldErrors.status}</span>
                        )}
                    </div>

                    <div className="custom-input-group" ref={dropdownRef}>
                        <label className="input-label">Cliente (opcional)</label>
                        {selectedClient ? (
                            <div className="client-selected">
                                <div className="client-selected-info">
                                    <span className="material-symbols-rounded">person</span>
                                    <span>{[selectedClient.name, selectedClient.surname].filter(Boolean).join(' ')}</span>
                                </div>
                                <button type="button" className="client-selected-clear" onClick={handleClearClient}>
                                    <span className="material-symbols-rounded">close</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="input-wrapper">
                                    <span className="material-symbols-rounded input-icon">search</span>
                                    <input
                                        type="text"
                                        className="custom-input"
                                        placeholder="Busca por nombre o email..."
                                        value={clientSearch}
                                        onChange={(e) => setClientSearch(e.target.value)}
                                        onFocus={() => clientSearch && setShowDropdown(true)}
                                    />
                                </div>
                                {showDropdown && (
                                    <div className="client-dropdown">
                                        {filteredClients.length === 0 ? (
                                            <div className="client-dropdown-empty">
                                                <span>Sin resultados</span>
                                                <Button
                                                    layout="icon-text-button"
                                                    icon="person_add"
                                                    label="Crear cliente"
                                                    variant="ghost"
                                                    size="md"
                                                    type="button"
                                                    onClick={() => setShowClientModal(true)}
                                                />
                                            </div>
                                        ) : (
                                            filteredClients.map(client => (
                                                <div key={client.id} className="client-dropdown-item" onMouseDown={() => handleSelectClient(client)}>
                                                    <span className="material-symbols-rounded">person</span>
                                                    <div>
                                                        <span className="client-dropdown-name">
                                                            {[client.name, client.surname].filter(Boolean).join(' ')}
                                                        </span>
                                                        {client.email && <span className="client-dropdown-email">{client.email}</span>}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">Ubicación y fecha</h2>

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

                    <Input
                        name="startDate"
                        label="Fecha de inicio"
                        icon="calendar_today"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        error={fieldErrors.startDate}
                    />
                </div>

                <div className="section">
                    <h2 className="section-title">Descripción</h2>

                    <div className={`custom-input-group ${fieldErrors.notes ? 'has-error' : ''}`}>
                        <div className="input-wrapper textarea-wrapper">
                            <textarea
                                name="notes"
                                className="custom-input custom-textarea"
                                placeholder="Describe los detalles de la obra..."
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
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

            <Modal isOpen={showClientModal} onClose={() => setShowClientModal(false)} title="Nuevo cliente">
                <ClientForm
                    onSuccess={handleClientCreated}
                    onCancel={() => setShowClientModal(false)}
                />
            </Modal>
        </div>
    );
};

export default EditProjectPage;