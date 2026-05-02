import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Button from '../components/Button';
import BalanceCard from '../components/BalanceCard';

const Dashboard = () => {
    const navigate = useNavigate();

    // datos del usuario desde el contexto global
    const { user, loading: authLoading } = useAuth();

    // para los datos del dashboard
    const [metrics, setMetrics] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setDataLoading(true);

                const response = await fetch(`/api/tenant/balance`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error('Error al cargar métricas');

                const result = await response.json();

                setMetrics(result.data);

            } catch (err) {
                setError(err.message);
            } finally {
                setDataLoading(false);
            }
        };

        if (user) fetchDashboardData();

    }, [user]);

    if (authLoading || dataLoading) return <div>Cargando información...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!metrics) return <div>No hay datos disponibles.</div>;

    return (

        <div className="dashboard-page">
            <div className="page-header">
                <h1>Panel de Control</h1>
                <div className="page-header-welcome">
                    <p>Hola, <strong>{user?.username}</strong></p>
                </div>
            </div>

            <section className="list">

                <BalanceCard
                    totalBalance={metrics.balanceWithIva}
                    totalIncome={metrics.incomeWithIva}
                    totalExpense={metrics.expenseWithIva}
                    balanceNoIva={metrics.balance}
                    incomeNoIva={metrics.income}
                    expenseNoIva={metrics.expense}
                    ivaAmountTotal={metrics.totalIva}
                />

                <Button classname="button"
                    layout="icon-text-button"
                    icon='construction'
                    label="Listado de obras"
                    size="lg"
                    info={`${metrics.projectsNumber} en total`}
                    onClick={() => navigate('/projects')} />

                <div className="block-row">

                    <Button classname="button"
                        layout="icon-text-button"
                        icon='receipt_long'
                        label="Movimientos"
                        size="lg"
                        variant='accent'
                        onClick={() => navigate('/movements')} />

                    <Button classname="button"
                        layout="icon-text-button"
                        icon='person'
                        label='Clientes'
                        size="lg"
                        variant='accent'
                        onClick={() => navigate('/clients')} />

                </div>

            </section>

            <Card subtitle={`Tienes ${metrics.pendingTasks} tareas pendientes en total`} className='muted centered' />
        </div>

    );
};

export default Dashboard;