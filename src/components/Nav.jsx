import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';


const Nav = () => {
    const STORAGE_URL = 'http://127.0.0.1:54321/storage/v1/object/public/app/';

    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [showMenu, setShowMenu] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const closeMenus = () => {
        setShowMenu(false);
        setShowActions(false);
    };
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav className="nav-container">
            {/* Esquina Superior Izquierda: Inicio y Perfil */}
            {user ? (
                <div className="corner top-left">
                    <div className='main-fabs'>
                        <NavLink to="/">
                            <Button
                                layout={isMobile ? 'icon-button' : 'icon-text-button'}
                                icon="flag"
                                variant="primary"
                                label="Inicio"
                            />
                        </NavLink>

                        <Button
                            layout={isMobile ? 'icon-button' : 'icon-text-button'}
                            icon="logout"
                            variant="accent"
                            onClick={logout}
                            label="Salir"
                        />
                    </div>
                </div>
            ) : (
                <div className="corner top-left">
                    <div className='main-fabs'>
                        <NavLink to="/">
                            <Button layout={isMobile ? 'icon-button' : 'icon-text-button'} icon="flag" variant="primary" label="Inicio" />
                        </NavLink>
                        <NavLink to="/login">
                            <Button layout="icon-text-button" icon="person" variant="accent" label="Login" />
                        </NavLink>
                        <NavLink to="/register" >
                            <Button layout="icon-text-button" icon="person_add" variant="accent" label="Regístrate" />
                        </NavLink>
                    </div>
                </div>
            )}

            {/* Esquina Superior Derecha: Theme, Mi Empresa y Dashboard */}
            <div className="corner top-right">
                <div className="main-fabs">
                    <Button
                        layout="icon-button"
                        icon={isDark ? 'light_mode' : 'dark_mode'}
                        variant="ghost"
                        onClick={toggleTheme}
                    />
                    {user && (
                        <>
                            <NavLink to="/tenant">
                                <Button layout="icon-text-button" icon="business" variant="accent" label="Mi empresa" />
                            </NavLink>
                            <NavLink to="/dashboard">
                                <Button layout={isMobile ? 'icon-button' : 'icon-text-button'} icon="home" variant="primary" label="Panel de control" />
                            </NavLink>
                        </>
                    )}
                </div>
            </div>

            {user && (<>
                {/* Esquina Inferior Derecha: Menu y + */}
                <div className="corner bottom-right">

                    <div className="main-fabs">
                        <Button
                            layout="icon-text-button"
                            icon={showMenu ? "close" : "menu"}
                            variant="accent"
                            size="lg"
                            label="Menú"
                            onClick={() => { setShowMenu(!showMenu); setShowActions(false); }}
                        />
                        <Button
                            className="pulse"
                            layout={isMobile ? 'icon-button' : 'icon-text-button'}
                            icon={showActions ? "close" : "add"}
                            size="circle-lg"
                            label='Añadir'
                            onClick={() => { setShowActions(!showActions); setShowMenu(false); }}
                        />
                    </div>
                </div>
            </>
            )}

            <div className="bottom-menu">
                <div className="desplegable">
                    {/* Desplegable de + */}
                    {showActions && (
                        <div className="fab-menu full">
                            <div className='actions'>
                                <NavLink to="/add-project">
                                    <Button size="md" className="full" layout="text-button" icon="construction" label="Añadir Obra" onClick={closeMenus} />
                                </NavLink>
                                <NavLink to="/add-movement">
                                    <Button size="md" className="full" layout="text-button" icon="euro_symbol" label="Añadir Movimiento" onClick={closeMenus} />
                                </NavLink>
                                <NavLink to="/add-client">
                                    <Button size="md" className="full" layout="text-button" icon="group_add" label="Añadir Cliente" onClick={closeMenus} />
                                </NavLink>
                            </div>

                        </div>
                    )}

                    {/* Desplegable de menu */}
                    {showMenu && (
                        <div className="fab-menu full">
                            <div className='navigation'>
                                <NavLink to="/dashboard">
                                    <Button size="md" className="full" layout="text-button" icon="dashboard" label="Panel de control" onClick={closeMenus} />
                                </NavLink>
                                <NavLink to="/projects">
                                    <Button size="md" className="full" layout="text-button" icon="construction" label="Obras" onClick={closeMenus} />
                                </NavLink>
                                <NavLink to="/movements">
                                    <Button size="md" className="full" layout="text-button" icon="receipt_long" label="Movimientos" onClick={closeMenus} />
                                </NavLink>
                                <NavLink to="/clients">
                                    <Button size="md" className="full" layout="text-button" icon="person" label="Clientes" onClick={closeMenus} />
                                </NavLink>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="corner bottom-left">
                <img src={isDark ? `${STORAGE_URL}obractionlogo-bg-dark1000.png` : `${STORAGE_URL}obractionlogo-bg1000.png`} alt="Obraction" className="logo-img" />
            </div>

        </nav>
    );
};

export default Nav;