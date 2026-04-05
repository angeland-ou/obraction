import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Button from '../components/Button';

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

                setMetrics(result.data || result); 
            
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
        <div>
            <header>
                <h1>Panel de Control</h1>
                <p>Bienvenido, <strong>{user?.username}</strong></p>
            </header>

            <section>
                <Card 
                    title="Balance Total" 
                    value={`${metrics.totalBalance}€`} 
                    subtitle="Sin IVA" 
                />
                <Card 
                    title="Ingresos" 
                    value={`${metrics.totalIncome}€`} 
                />
                <Card 
                    title="Gastos" 
                    value={`${metrics.totalExpense}€`} 
                />
                
                <Card 
                    title="Obras Activas" 
                    value={metrics.projectsNumber} 
                />
                <Button classname="button"
                type="text-button" 
                label="Mis obras" 
                onClick={() => navigate('/projects')}/>
                <Card 
                    title="Tareas pendientes" 
                    value={metrics.pendingTasks} 
                />
                
            </section>
        </div>
    );
};

export default Dashboard;