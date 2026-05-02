import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activateAccount } from '../api/auth';

const ActivationPage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading');
    const navigate = useNavigate();

    const activationStarted = useRef(false);

    useEffect(() => {
        if (activationStarted.current) return;
        activationStarted.current = true;

        const triggerActivation = async () => {
            try {
                await activateAccount(token);
                setStatus('success');
                // redirigimos a login - pendiente hacer página con info de que revisen el email
                setTimeout(() => navigate('/login'), 3000);
            } catch (err) {
                console.error('Error en la activación', err.message)
                setStatus('error');
            }
        };

        triggerActivation();
    }, [token, navigate]);

    return (
        <div className="activation-layout">
            {status === 'loading' && <p>Verificando credenciales en Obraction...</p>}
            {status === 'success' && <p>¡Cuenta confirmada!...</p>}
            {status === 'error' && <p>Ha ocurrido un error. Contacta con soporte.</p>}
        </div>
    );
};

export default ActivationPage;