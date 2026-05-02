import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllMovements } from '../api/movements';
import Card from '../components/Card';
import Button from '../components/Button';
import { normalize } from '../utils/normalize';

const MOVEMENT_CONFIG = {
    income: { status: 'success', color: '#22c55e', icon: 'trending_up', label: 'Ingreso' },
    expense: { status: 'danger', color: '#ef4444', icon: 'trending_down', label: 'Gasto' },
};

const MovementsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('projectId');

    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await getAllMovements(projectId);
                setMovements(response.data || []);
                console.log('primer movimiento:', response.data?.[0]);
            } catch (err) {
                setError(err.data?.error?.message || err.message || 'Error al cargar los movimientos');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [projectId]);

    const filtered = movements.filter(m => {
        if (!search) return true;
        const term = normalize(search);
        return (
            normalize(m.concept).includes(term) ||
            normalize(m.notes).includes(term) ||
            normalize(m.project?.name).includes(term)
        );
    });

    const projectName = movements.find(m => m.projectId === projectId)?.project?.name;

    if (loading) return (
        <div className="page-loading">
            <span className="material-symbols-rounded spinning">sync</span>
            <p>Cargando movimientos...</p>
        </div>
    );

    if (error) return (
        <div className="form-error-banner">
            <span className="material-symbols-rounded">error</span>
            {error}
        </div>
    );

    return (
        <div className="movements-page">

            <div className="page-header">
                <div>
                    <h1>Movimientos</h1>

                    {projectId && (
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>

                            pertenecientes a <strong>{projectName || 'obra actual'}</strong>  /
                            <button
                                style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'underline' }}
                                onClick={() => navigate('/movements')}
                            > Ver todos</button>
                        </p>
                    )}
                </div>
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
                        label="Nuevo movimiento"
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/add-movement')}
                    />
                </div>

            </div>

            <div className="custom-input-group">
                <div className="input-wrapper">
                    <span className="material-symbols-rounded input-icon">search</span>
                    <input
                        type="text"
                        className="custom-input"
                        placeholder="Buscar por concepto, notas o nombre de obra..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="list">
                {filtered.length === 0 ? (
                    <div className="list-empty">
                        <span className="material-symbols-rounded">receipt_long</span>
                        <p>{search ? 'No hay movimientos que coincidan.' : 'Aún no hay movimientos registrados.'}</p>
                    </div>
                ) : (
                    filtered.map(m => {
                        const config = MOVEMENT_CONFIG[m.type];
                        const fecha = new Date(m.movementDate).toLocaleDateString('es-ES');
                        const importe = `${m.type === 'income' ? '+' : '-'} ${Number(m.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €`;

                        return (
                            <Card
                                key={m.id}
                                title={m.concept || '(Sin concepto)'}
                                subtitle={m.project?.name ? `${m.project.name} · ${fecha}` : `General · ${fecha}`}
                                value={importe}
                                status={config.status}
                                badge={{ color: config.color, icon: config.icon }}
                                onClick={() => navigate(`/movements/${m.id}`)}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MovementsPage;