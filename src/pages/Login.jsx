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
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            // llamada a endpoint login de backend
            const response = await login(formData.email, formData.password);

            // guardamos user en context global -> json -> {user: data.user...}
            setUser(response.data?.user);

            // redirigimos al dashboard
            navigate('/dashboard');
        } catch (err) {

            // console.log("Status:", err.status);
            // console.log("Data:", err.data?.error);
            // console.log("Details:", err.data);

            if (err.status === 400 && err.data?.error?.details) {
                const errors = {};
                err.data.error.details.forEach(({ path, message }) => {
                    errors[path[0]] = message;
                });
                setFieldErrors(errors);
            } else {
                setError(err.data?.error?.message || err.message || "Error al iniciar sesión")
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <h1>Accede a tu cuenta</h1>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                <Input
                    name="email"
                    label="email"
                    icon="mail"
                    type="email"
                    placeholder="Correo electrónico"
                    onChange={handleChange}
                    error={fieldErrors.email}
                />
                <Input
                    name="password"
                    label="password"
                    icon="lock"
                    type="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                    error={fieldErrors.password}
                />

                <Button
                    size="md"
                    className="right"
                    type="submit"
                    layout="icon-text-button"
                    icon={isSubmitting ? "sync" : "login"}
                    label={isSubmitting ? "Cargando..." : "Entrar"}
                    disabled={isSubmitting}
                />
            </form>

            <p style={{ paddingTop: '16px', color: 'var(--text-muted)' }}>¿No tienes cuenta? <span className="link" onClick={() => navigate('/register')}>Regístrate</span></p>
        </div>
    );
};

export default LoginPage;