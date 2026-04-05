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
        console.log("Enviando...")
        setError(null);
        try {
            await register(formData);
            setSuccess(true);
            
            // redirigimos al login después de 3 segundos
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    if (success) return <div>¡Registrado con éxito! Revisa tu email para activar tu cuenta.</div>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Crea tu cuenta en Obraction</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <Input 
                name="username"
                label="username"
                icon="person"
                type="text"
                placeholder="Nombre de usuario"
                onChange={handleChange}
            />

            <Input 
                name="nif"
                label="nif"
                icon="id_card"
                type="text"
                placeholder="NIF / CIF"
                onChange={handleChange}
            />

            <Input 
                name="tenantName"
                label="nombre de la empresa"
                icon="home_work"
                type="text"
                placeholder="Nombre de la empresa"
                onChange={handleChange}
            />

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
                icon="login"
                label="Registrarse"
                />
        </form>
    );
};

export default RegisterPage;