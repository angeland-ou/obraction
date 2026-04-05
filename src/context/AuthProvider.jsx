import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext'; 

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (res.ok) setUser(data.user);
        } catch (error) {
            console.error("Error comprobando autenticación", error)
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // borramos cookie
            const res = await fetch('/api/auth/logout', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                console.log("Sesión cerrada en servidor");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setUser(null);
        }
    };

    useEffect(() => { checkAuth(); }, []);

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};