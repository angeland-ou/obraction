import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { getMe, logout as logoutService } from '../api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const userData = await getMe();
            setUser(userData.data?.user);
        } catch (error) {
            console.error("Error comprobando autenticación", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);


    const logout = async () => {
        try {
            await logoutService();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setUser(null); // limpiamos siempre el usuario
        }
    };

    // escuchamos eventos desde http.js
    useEffect(() => {
        const handleForceLogout = () => {
            console.warn("Auth: Force logout (401)");
            setUser(null); // limpiamos el usuario para redirigir
        };

        // listener del canal de eventos
        window.addEventListener('force-logout', handleForceLogout);

        // remove listener
        return () => {
            window.removeEventListener('force-logout', handleForceLogout);
        };
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
    
};