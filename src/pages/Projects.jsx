import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const ProjectList = ({list}) => {
    const sortedList = [...list].sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate);
    });
    return(
        <ul>
            {sortedList.map((item) => (
                <li key={item.id}>
                    <Link to={`/projects/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <Card
                        title={item.name} 
                        value={`${item.balance?.balance ||0}€`} 
                        subtitle={item.status} 
                        />
                    </Link>
                    
                </li>
            ))}
            
        </ul>
    )                
}

const Projects = () => {
    // datos del usuario desde el contexto global
    const { user, loading: authLoading } = useAuth(); 

    // estados para los datos del listado
    const [list, setList] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
            const fetchProjectListData = async () => {
                try {
                    setDataLoading(true);
                    
                    const response = await fetch(`/api/projects`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
    
                    if (!response.ok) throw new Error('Error al cargar métricas');
    
                    const result = await response.json();
    
                    setList(result.data || result); 
                
                } catch (err) {
                    setError(err.message);
                } finally {
                    setDataLoading(false);
                }
            };
    
            if (user) fetchProjectListData();
            
        }, [user]); 
    
        // renderizado condicional de estados
        if (authLoading || dataLoading) return <div>Cargando información...</div>;
        if (error) return <div>Error: {error}</div>;
        if (!list) return <div>No hay datos disponibles.</div>;

    return (
         <div>
            <header>
                <h1>Listado de Obras</h1>
            </header>

            <section>
                <ProjectList list={list} />
            </section>
        </div>
    );
};

export default Projects;