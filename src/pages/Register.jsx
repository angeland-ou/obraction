import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

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
            
            <input name="username" placeholder="Tu nombre" onChange={handleChange} />
            <input name="nif" placeholder="Nif" onChange={handleChange} />
            <input name="tenantName" placeholder="Nombre de la empresa" onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} />

            <button type="submit">Registrar empresa</button>
        </form>
    );
};

export default RegisterPage;