import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';

const Nav = () => {
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [showActions, setShowActions] = useState(false);

    return (
        <nav className="mobile-nav-container">
            {/* Esquina Superior Izquierda: Perfil */}
            {user ? (
                <div className="corner top-left">
                    <Button layout="icon-button" icon="logout" variant="accent" onClick={logout}/>   
                </div>
            ) : (
                <div className="corner top-left">
                    <div className='main-fabs'>
                        <NavLink to="/login">
                        <Button layout="icon-text-button" icon="person" variant="accent" label="Login" />
                    </NavLink>
                    <NavLink to="/register" >
                        <Button layout="icon-text-button" icon="person_add" variant="accent" label="Regístrate" />
                    </NavLink>
                    </div>
                </div>
            )}

            {/* Esquina Superior Derecha: Dashboard */}
            <div className="corner top-right">
                <NavLink to="/dashboard">
                    <Button layout="icon-button" icon="home" variant="accent" />
                </NavLink>
                
            </div>

            {/* Esquina Inferior Derecha: Menu y + */}
            <div className="corner bottom-right">
                
                <div className="main-fabs">
                    <Button 
                        layout="icon-button" 
                        icon={showMenu ? "close" : "menu"} 
                        variant="accent"
                        size = "lg"
                        onClick={() => { setShowMenu(!showMenu); setShowActions(false); }} 
                    />
                    <Button 
                        className="pulse"
                        layout="icon-button" 
                        icon={showActions ? "close" : "add"} 
                        size = "lg"
                        onClick={() => { setShowActions(!showActions); setShowMenu(false); }}
                    />
                </div>
            </div>

            <div className="bottom-menu">
                <div className="desplegable">
                    {/* Desplegable de + */}
                    {showActions && (
                        <div className="fab-menu full">
                            <div className='actions'>
                                <Button size = "md" className="full" layout="text-button" icon="construction" label="Añadir Obra" />
                                <Button size = "md" className="full" layout="text-button" icon="euro_symbol" label="Añadir Movimiento" />
                                <Button size = "md" className="full" layout="text-button" icon="group_add" label="Añadir Cliente" />
                            </div>
                            
                        </div>
                    )}

                    {/* Desplegable de bars */}
                    {showMenu && (
                        <div className="fab-menu full">
                            <div className='navigation'>
                                <NavLink to="/dashboard">
                                    <Button size = "md" className="full" layout="text-button" icon="dashboard" label="Panel de control" />
                                </NavLink>
                                <NavLink to="/projects">
                                    <Button size = "md" className="full" layout="text-button" icon="construction" label="Mis obras" />
                                </NavLink>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </nav>
    );
};

export default Nav;