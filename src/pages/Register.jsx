import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        nif: '',
        tenantName: ''
    });
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            if (err.status === 400 && err.data?.error?.details) {
                const errors = {};
                err.data.error.details.forEach(({ path, message }) => {
                    errors[path[0]] = message;
                });
                setFieldErrors(errors);
            } else {
                setError(err.data?.error?.message || err.message || 'Error al registrarse');
            }
        }
    };

    if (success) return <div>¡Registrado con éxito! Revisa tu email para activar tu cuenta.</div>;

    return (
        <div className="register-page">
            <form onSubmit={handleSubmit}>
                <h2>Crea tu cuenta en Obraction</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                <Input
                    name="username"
                    label="username"
                    icon="person"
                    type="text"
                    placeholder="Nombre de usuario"
                    onChange={handleChange}
                    error={fieldErrors.username}
                />

                <Input
                    name="nif"
                    label="nif"
                    icon="id_card"
                    type="text"
                    placeholder="NIF / CIF"
                    onChange={handleChange}
                    error={fieldErrors.nif}
                />

                <Input
                    name="tenantName"
                    label="nombre de la empresa"
                    icon="home_work"
                    type="text"
                    placeholder="Nombre de la empresa"
                    onChange={handleChange}
                    error={fieldErrors.tenantName}
                />

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
                    icon="login"
                    label="Registrarse"
                />
            </form>
        </div>
    );
};

export default RegisterPage;