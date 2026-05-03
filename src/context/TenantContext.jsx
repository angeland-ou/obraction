import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTenant } from '../api/tenant';
import { AuthContext } from './AuthContext';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    const [tenantLogo, setTenantLogo] = useState(() => {
        return localStorage.getItem('tenantLogo') || null;
    });

    const [tenantColor, setTenantColor] = useState(() => {
        return localStorage.getItem('tenantColor') || null;
    });

    useEffect(() => {
        const fetchTenantBranding = async () => {
            try {
                const response = await getTenant();
                const t = response.data;

                if (t?.logoUrl) {
                    setTenantLogo(t.logoUrl);
                    localStorage.setItem('tenantLogo', t.logoUrl);
                }
                if (t?.primaryColor) {
                    setTenantColor(t.primaryColor);
                    localStorage.setItem('tenantColor', t.primaryColor);
                    document.documentElement.style.setProperty('--primary', t.primaryColor);
                }
            } catch (err) {
                console.error('Error cargando branding del tenant', err);
            }
        };

        if (user) {
            fetchTenantBranding();
        } else {
            // limpiamos branding al cerrar sesión
            setTenantLogo(null);
            setTenantColor(null);
            localStorage.removeItem('tenantLogo');
            localStorage.removeItem('tenantColor');
        }

    }, [user]);

    const updateLogo = (url) => {
        setTenantLogo(url);
        if (url) localStorage.setItem('tenantLogo', url);
        else localStorage.removeItem('tenantLogo');
    };

    const updateColor = (color) => {
        setTenantColor(color);
        localStorage.setItem('tenantColor', color);
        document.documentElement.style.setProperty('--primary', color);
    };

    return (
        <TenantContext.Provider value={{ tenantLogo, tenantColor, updateLogo, updateColor }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);