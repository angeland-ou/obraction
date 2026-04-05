import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    console.log("Estado de Auth:", { user, loading });

    // mostramos carga mientras responde servidor
    if (loading) {
        return <div>Verificando sesión...</div>;
    }

    // si no hay usuario, redirigimos a login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // si todo está ok, mostramos la página
    return children;
};

export default ProtectedRoute;