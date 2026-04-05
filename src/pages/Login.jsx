import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage = () => {
    // guardamos al usuario
    const { setUser } = useAuth(); 
    
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // llamada a endpoint login de backend
            const response = await login(formData.email, formData.password);
            
            // guardamos user en context global -> json -> {user: data.user...}
            setUser(response.user); 

            // redirigimos al dashboard
            navigate('/dashboard'); 
        } catch (err) {
            // error con mensaje del backend
            setError(err.response?.data?.error || "Error al iniciar sesión");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <h1>Bienvenido</h1>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                
                <Input 
                    name="email"
                    label="email"
                    icon="mail"
                    type="email"
                    placeholder="Correo electrónico"
                    onChange={handleChange}
                    
                />
                <Input 
                    name="password"
                    label="password"
                    icon="lock"
                    type="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                    
                />

                <Button
                size = "md"
                className="right"
                type="submit"
                layout="icon-text-button"
                icon={isSubmitting ? "sync" : "login"} 
                label={isSubmitting ? "Cargando..." : "Entrar"} 
                disabled={isSubmitting}
                />
            </form>
            
            <p>¿No tienes cuenta? <span className="link" onClick={() => navigate('/register')}>Regístrate</span></p>
        </div>
    );
};

export default LoginPage;