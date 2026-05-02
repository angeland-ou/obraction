import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import BalanceCard from '../components/BalanceCard';
import Button from '../components/Button';
import { getProjectById, deleteProject } from '../api/projects';
import { createTask, updateTask, deleteTask } from '../api/tasks';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';

const ESTADOS = [
    { value: 'pending', label: 'Pendiente', color: 'var(--neutral)' },
    { value: 'in_progress', label: 'En ejecución', color: 'var(--primary)' },
    { value: 'blocked', label: 'Pausada', color: 'var(--color-warning)' },
    { value: 'done', label: 'Finalizada', color: 'var(--color-success)' },
];

const ESTADOS_TASKS = [
    { value: 'pending', label: 'Pendiente', color: 'var(--color-danger)' },
    { value: 'done', label: 'Realizada', color: 'var(--color-success)' }
]

const TASK_FILTER_CONFIG = [
    { value: '', label: 'Todas', variant: 'ghost', icon: 'filter_list' },
    { value: 'pending', label: 'Pendientes', variant: 'danger', icon: 'pending_actions' },
    { value: 'done', label: 'Realizadas', variant: 'success', icon: 'check' },
];

const ProjectDetail = () => {
    const { id } = useParams(); // capturamos id de la url
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [confirmDelete, setConfirmDelete] = useState(false);

    // Task create
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [createTaskError, setCreateTaskError] = useState(null);
    const [createTaskFieldErrors, setCreateTaskFieldErrors] = useState({});
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    // Task edit
    const [editingTask, setEditingTask] = useState(null); // task completa o null
    const [taskError, setTaskError] = useState(null);
    const [taskFieldErrors, setTaskFieldErrors] = useState({});
    const [isSubmittingTask, setIsSubmittingTask] = useState(false);

    // Task delete
    const [deletingTask, setDeletingTask] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [taskFilter, setTaskFilter] = useState('pending');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await getProjectById(id);
                setProject(response.data);

            } catch (err) {
                setError(err.data?.error?.message || err.message || 'Error al cargar los datos de la obra');
            } finally {
                setLoading(false);
            }
        };

        if (user && id) fetchProject();
    }, [user, id]);

    const balance = project?.balance?.balance || 0;

    const totalIncome = project?.income?.totalWithIva;
    const totalExpense = project?.expense?.totalWithIva;

    const ivaAmountTotal = (project?.income?.totalIva || 0) - (project?.expense?.totalIva ?? 0);
    const balanceNoIva = balance - ivaAmountTotal;

    const totalIncomeNoIva = project?.income?.totalAmount || 0;
    const totalExpenseNoIva = project?.expense?.totalAmount || 0;


    const handleOpenEditTask = (task) => {
        setTaskError(null);
        setTaskFieldErrors({});
        setEditingTask(task);
    };

    const handleCloseEditTask = () => {
        setEditingTask(null);
        setTaskError(null);
        setTaskFieldErrors({});
    };

    const handleUpdateTask = async (formData) => {
        setTaskError(null);
        setTaskFieldErrors({});
        setIsSubmittingTask(true);

        try {
            const response = await updateTask(id, editingTask.id, formData);

            // actualizamos la tarea
            setProject(prev => ({
                ...prev,
                tasks: prev.tasks.map(t =>
                    t.id === editingTask.id ? { ...t, ...response.data } : t
                )
            }));

            handleCloseEditTask();
        } catch (err) {
            if (err.status === 400 && err.data?.error?.details) {
                const errors = {};
                err.data.error.details.forEach(({ path, message }) => {
                    errors[path[0]] = message;
                });
                setTaskFieldErrors(errors);
            } else {
                setTaskError(err.data?.error || err.message || 'Error al actualizar la tarea');
            }
        } finally {
            setIsSubmittingTask(false);
        }
    };

    // Create task
    const handleOpenCreateTask = () => {
        setCreateTaskError(null);
        setCreateTaskFieldErrors({});
        setShowCreateTask(true);
    };

    const handleCloseCreateTask = () => {
        setShowCreateTask(false);
        setCreateTaskError(null);
        setCreateTaskFieldErrors({});
    };

    const handleCreateTask = async (formData) => {
        setCreateTaskError(null);
        setCreateTaskFieldErrors({});
        setIsCreatingTask(true);

        try {
            const response = await createTask(id, formData);
            setProject(prev => ({
                ...prev,
                tasks: [...(prev.tasks || []), response.data]
            }));
            handleCloseCreateTask();
        } catch (err) {
            if (err.status === 400 && err.data?.error?.details) {
                const errors = {};
                err.data.error.details.forEach(({ path, message }) => { errors[path[0]] = message; });
                setCreateTaskFieldErrors(errors);
            } else {
                setCreateTaskError(err.data?.error || err.message || 'Error al crear la tarea');
            }
        } finally {
            setIsCreatingTask(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        setIsDeleting(true);
        try {
            await deleteProject(id);
            navigate('/projects');
        } catch (err) {
            setError(err.data?.error?.message || err.message || 'Error al eliminar la obra');
            setIsDeleting(false);
            setConfirmDelete(false);
        }
    };

    // Delete Task
    const handleConfirmDelete = (task) => {
        setDeletingTask(task);
    };

    const handleCancelDelete = () => {
        setDeletingTask(null);
    };

    const handleDeleteTask = async () => {
        setIsDeleting(true);
        try {
            await deleteTask(id, deletingTask.id);
            setProject(prev => ({
                ...prev,
                tasks: prev.tasks.filter(t => t.id !== deletingTask.id)
            }));
            setDeletingTask(null);
        } catch (err) {
            setError(err.data?.error?.message || err.message || 'Error al eliminar la tarea');
            setDeletingTask(null);
        } finally {
            setIsDeleting(false);
        }
    };

    if (authLoading || loading) return <div>Cargando detalles de la obra...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>No se encontró la obra.</div>;

    const statusLabel = ESTADOS.find(e => e.value === project.status)?.label || project.status;
    const statusColor = ESTADOS.find(e => e.value === project.status)?.color || 'var(--neutral)';

    const clientName = (project.client?.name !== undefined && project.client?.name) ? (project.client?.name + ' ' + project.client?.surname) : 'Sin cliente asignado';

    const filteredTasks = (project.tasks || []).filter(t =>
        taskFilter ? t.status === taskFilter : true
    );

    return (

        <div className="project-detail-page">

            <div className="page-header">
                <div className='page-header-title-block'>
                    <h1>{project?.name || 'Obra'}</h1>
                    <span style={{ color: statusColor }}>
                        {statusLabel}
                    </span>
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
                        onClick={() => navigate(`/projects/${project.id}/edit`)}
                    />

                    <Button
                        layout="icon-text-button"
                        icon={isDeleting ? 'sync' : confirmDelete ? 'warning' : 'delete'}
                        label={isDeleting ? 'Eliminando...' : confirmDelete ? '¿Confirmar?' : 'Borrar'}
                        variant={confirmDelete ? 'danger' : 'ghost'}
                        size="sm"
                        onClick={handleDeleteProject}
                        disabled={isDeleting}
                    />
                </div>
            </div>

            <div>
                <BalanceCard
                    totalBalance={balance}
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                    balanceNoIva={balanceNoIva}
                    incomeNoIva={totalIncomeNoIva}
                    expenseNoIva={totalExpenseNoIva}
                    ivaAmountTotal={ivaAmountTotal}
                />
            </div>

            <section>
                <div className='project-general-info'>

                    <h2>Información General</h2>
                    <div className='data'>
                        <p><strong>Fecha de inicio:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                        <p>
                            <strong>Cliente: </strong>
                            {project.clientId ? (
                                <span className="link" onClick={() => navigate(`/clients/${project.clientId}`)}>
                                    {clientName}
                                </span>
                            ) : clientName}
                        </p>
                        {project.notes ? (<p><strong>Notas:</strong> {project.notes || ''}</p>) : ''}
                        {project.address ? (<p><strong>Dirección:</strong> {project.address || ''}</p>) : ''}
                    </div>


                    <div className='last-movements'>
                        <ul>
                            {[...(project.movements || [])]
                                .slice(0, 3)
                                .sort((a, b) => new Date(b.movementDate) - new Date(a.movementDate))
                                .map((movement) => (
                                    <li key={movement.id}>
                                        <span>{[movement.concept, new Date(movement.movementDate).toLocaleDateString()].filter(Boolean).join(' - ')}</span>
                                        <span style={{
                                            color: movement.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)'
                                        }}>
                                            {movement.type === 'income' ? '+ ' : '- '} {movement.amount}
                                        </span>
                                    </li>
                                ))}
                            {project.movements?.length === 0 && <p>No hay movimientos todavía.</p>}
                        </ul>
                        <Button
                            layout="icon-text-button"
                            icon="receipt_long"
                            label="Ver todos los movimientos"
                            variant="primary"
                            size="sm"
                            type="button"
                            info={`(hay ${project.movements?.length || '0'} en total)`}
                            onClick={() => navigate(`/movements?projectId=${project.id}`)}
                        />
                    </div>


                    <h2>Tareas</h2>

                    <div className="filter-bar">
                        <div className="filter-bar-status">
                            {TASK_FILTER_CONFIG.map(({ value, label, variant, icon }) => (
                                <Button
                                    key={value}
                                    layout="text-button"
                                    className={`filter-pill ${taskFilter === value ? 'active' : ''}`}
                                    onClick={() => setTaskFilter(value)}
                                    label={label}
                                    icon={icon}
                                    variant={variant}
                                    size="xs"
                                />
                            ))}
                        </div>
                    </div>

                    <div className='tasks-list'>
                        <ul>
                            {filteredTasks.map((task) => (
                                <li key={task.id}>

                                    <div className='task'>
                                        <span style={{ fontSize: '0.6em', letterSpacing: '0.1em', borderRadius: '10px', padding: '0px 10px', maxWidth: 'fit-content', color: '#fff', backgroundColor: ESTADOS_TASKS.find(e => e.value === task.status)?.color || 'var(--soft)' }}>
                                            {ESTADOS_TASKS.find(e => e.value === task.status)?.label || task.status}
                                        </span>
                                        <span style={{ fontSize: '0.9em', fontWeight: '700' }}>{task.title}</span>

                                        {task.description && (
                                            <span style={{ fontSize: '0.75em' }}>{task.description}</span>
                                        )}

                                        {task.dueDate && (
                                            <span style={{ fontSize: '0.75em', color: 'var(--soft)' }}
                                                className={new Date(task.dueDate) < new Date(new Date().toDateString()) ? 'task-overdue' : ''}>
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                                        <Button
                                            layout="icon-button"
                                            icon="edit"
                                            label="Editar tarea"
                                            variant="accent"
                                            onClick={() => handleOpenEditTask(task)}
                                        />
                                        <Button
                                            layout="icon-button"
                                            icon="delete"
                                            label="Borrar tarea"
                                            variant="danger"
                                            onClick={() => handleConfirmDelete(task)}
                                        />
                                    </div>
                                </li>
                            ))}
                            {filteredTasks.length === 0 && (
                                <p>No hay tareas {taskFilter === 'pending' ? 'pendientes' : taskFilter === 'done' ? 'realizadas' : ''} asignadas.</p>
                            )}
                        </ul>

                        <Button
                            layout="icon-text-button"
                            icon="add"
                            label="Añadir tarea"
                            variant="accent"
                            size="sm"
                            type="button"
                            onClick={handleOpenCreateTask}
                        />
                    </div>

                </div>
            </section>

            <Modal isOpen={showCreateTask} onClose={handleCloseCreateTask} title="Nueva tarea">
                <TaskForm
                    onSubmit={handleCreateTask}
                    onCancel={handleCloseCreateTask}
                    isSubmitting={isCreatingTask}
                    fieldErrors={createTaskFieldErrors}
                    error={createTaskError}
                />
            </Modal>

            <Modal
                isOpen={!!editingTask}
                onClose={handleCloseEditTask}
                title="Editar tarea"
            >
                {editingTask && (
                    <TaskForm
                        initialData={editingTask}
                        onSubmit={handleUpdateTask}
                        onCancel={handleCloseEditTask}
                        isSubmitting={isSubmittingTask}
                        fieldErrors={taskFieldErrors}
                        error={taskError}
                    />
                )}
            </Modal>

            <Modal isOpen={!!deletingTask} onClose={handleCancelDelete} title="Eliminar tarea">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <p style={{ margin: 0 }}>
                        ¿Estás seguro de que quieres eliminar la tarea <strong>{deletingTask?.title}</strong>? Esta acción no se puede deshacer.
                    </p>
                    <div className="form-actions">
                        <Button
                            layout="text-button"
                            label="Cancelar"
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={handleCancelDelete}
                        />
                        <Button
                            layout="icon-text-button"
                            icon={isDeleting ? 'sync' : 'delete'}
                            label={isDeleting ? 'Eliminando...' : 'Eliminar'}
                            variant="danger"
                            size="sm"
                            type="button"
                            onClick={handleDeleteTask}
                            disabled={isDeleting}
                        />
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default ProjectDetail;