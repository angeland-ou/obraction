import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Button from '../components/Button';

const ProjectDetail = () => {
    const { id } = useParams(); // capturamos id de la url
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/projects/${id}`);
                
                if (!response.ok) {
                    if (response.status === 404) throw new Error('Obra no encontrada');
                    throw new Error('Error al cargar los datos de la obra');
                }

                const result = await response.json();
                setProject(result.data || result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user && id) fetchProject();
    }, [user, id]);

    if (authLoading || loading) return <div>Cargando detalles de la obra...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>No se encontró la obra.</div>;

    return (
        <div>
            {/* volver atrás */}
            <Button classname="button"
                type="icon-button" 
                icon="arrow_back" 
                label="Volver al listado" 
                variant="accent"
                onClick={() => navigate('/projects')}/>

            <header>
                <h1>{project.name}</h1>
                <span style={{ color: project.status === 'in_progress' ? 'green' : 'darkgrey' }}>
                    {project.status}
                </span>
            </header>

            <div>
                <Card title="Balance" value={`${project.balance ||0}€`} subtitle="balance sin iva" />
                <Card title="Ingresos" value={`${project.totalIncome ||0}€`} subtitle="total ingresos sin iva" />
                <Card title="Gastos" value={`${project.totalExpenses ||0}€`} subtitle="total gastos sin iva" />
            </div>

            <section>
                <h2>Información General</h2>
                <div>
                    <div>
                        <p>Fecha de inicio: {new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p>Cliente: {project.client?.name || 'Sin cliente asignado.'}</p>
                    </div>
                    <div>
                        <p>
                            {project.notes || ''}
                        </p>
                    </div>
                    <div>
                        <p>Tareas: {project.tasks?.length || '0'} </p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {project.tasks?.map((task) => (
                                <li key={task.id} style={{ 
                                    padding: '10px', 
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>{task.title}</span>
                                    <span style={{ 
                                        fontSize: '0.8rem', 
                                        color: task.status === 'completed' ? 'green' : 'orange' 
                                    }}>
                                        {task.status}
                                    </span>
                                </li>
                            ))}
                            {project.tasks?.length === 0 && <p>No hay tareas asignadas.</p>}
                        </ul>
                    </div>
                    <div>
                        <p>Movimientos: {project.movements?.length || '0'} </p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {project.movements?.map((movement) => (
                                <li key={movement.id} style={{ 
                                    padding: '10px', 
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>{movement.concept} - {new Date(movement.movementDate).toLocaleDateString()}</span>
                                    <span style={{ 
                                        fontSize: '0.8rem', 
                                        color: movement.type === 'income' ? 'green' : 'orange' 
                                    }}>
                                        {movement.type === 'income' ? '+ ' : '- '} {movement.amount}
                                    </span>
                                </li>
                            ))}
                            {project.movements?.length === 0 && <p>No hay movimientos todavía.</p>}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProjectDetail;