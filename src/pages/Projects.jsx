import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getAllProjects } from '../api/projects';
import Card from '../components/Card';
import Button from '../components/Button';
import { normalize } from '../utils/normalize';

const STATUS_CONFIG = {
    in_progress:   { color: 'var(--primary)', icon: 'construction', label: 'Ejecutándose', variant: 'primary'},
    pending: { color: 'var(--color-neutral)', icon: 'pending_actions', label:'Pendientes', variant: 'neutral'},
    blocked:  { color: 'var(--color-warning)', icon: 'block', label:'Pausadas', variant: 'accent'},
    done:  { color: 'var(--color-success)', icon: 'check', label:'Finalizadas', variant: 'success'},
};

const Projects = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [list, setList] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        const fetchProjectListData = async () => {
            try {
                setDataLoading(true);
                const result = await getAllProjects();
                setList(result.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setDataLoading(false);
            }
        };

        if (user) fetchProjectListData();
    }, [user]);

    const filtered = list
        .filter(p => {
            const term = normalize(search);
            const matchesSearch =
                normalize(p.name).includes(term) || normalize(p.notes).includes(term);
            const matchesStatus = statusFilter ? p.status === statusFilter : true;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const diff = new Date(b.startDate) - new Date(a.startDate);
            return sortOrder === 'desc' ? diff : -diff;
        });

    if (authLoading || dataLoading) return (
        <div className="page-loading">
            <span className="material-symbols-rounded spinning">sync</span>
            <p>Cargando obras...</p>
        </div>
    );

    if (error) return (
        <div className="form-error-banner">
            <span className="material-symbols-rounded">error</span>
            {error}
        </div>
    );

    return (
        <div className="projects-page">

            <div className="page-header">
                <h1>Obras</h1>
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
                        icon="add"
                        label="Nueva obra"
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/add-project')}
                    />
                </div>
                
            </div>

            <div className="custom-input-group">
                <div className="input-wrapper">
                    <span className="material-symbols-rounded input-icon">search</span>
                    <input
                        type="text"
                        className="custom-input"
                        placeholder="Buscar por nombre o notas..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="filter-bar">
                <div className="filter-bar-order">
                    <Button
                        layout="icon-text-button"
                        className="filter-sort"
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        icon={sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                        label='Ordenado:'
                        size='xs'
                        variant="ghost"
                        info={sortOrder === 'desc' ? 'Recientes' : 'Antiguas'}
                    />
                </div>
                <div className="filter-bar-status">
                    {[
                        { value: '', label: 'Todas', variant: 'ghost', icon: 'filter_list' },
                        ...Object.entries(STATUS_CONFIG).map(([value, { label, variant, icon }]) => ({ value, label, variant, icon }))
                        ].map(({ value, label, variant, icon }) => (
                            <Button
                                key={value}
                                layout="text-button"
                                className={`filter-pill ${statusFilter === value ? 'active' : ''}`}
                                onClick={() => setStatusFilter(value)}
                                label={label}
                                icon={icon}
                                variant={variant}
                                size='xs'
                            />
                    ))}
                </div>
            </div>

            <div className="list">
                {filtered.length === 0 ? (
                    <div className="list-empty">
                        <span className="material-symbols-rounded">construction</span>
                        <p>{search || statusFilter ? 'No hay obras que coincidan.' : 'Aún no hay obras registradas.'}</p>
                    </div>
                ) : (
                    filtered.map(item => {
                        const config = STATUS_CONFIG[item.status];
                        const formattedDate = item.startDate ? `Fecha de inicio: ${new Date(item.startDate).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                            })}` : '';
                        return (
                            <Card
                                key={item.id}
                                className={`project ${item.balance?.balance > 0 ? 'card-status-success' : item.balance?.balance < 0 ? 'card-status-danger' : ''}`}
                                title={item.name}
                                value={`${item.balance?.balance || 0} €`}
                                income={`+ ${item.balance?.totalIncome || 0} €`}
                                expense={`- ${item.balance?.totalExpenses || 0} €`}
                                subtitle={formattedDate}
                                status={item.status}
                                badge={{ color: config?.color, icon: config?.icon }}
                                {...(item.pendingTasks && { globe: item.pendingTasks } )}
                                onClick={() => navigate(`/projects/${item.id}`)}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Projects;