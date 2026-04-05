import { useEffect, useState, useRef } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';

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
                const response = await fetch(`http://localhost:3000/api/auth/activate/${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setStatus('error');
                    console.error("Error del backend:", data.error);
                }
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
            {status === 'error' && <p>Token inválido o expirado. Contacta con soporte.</p>}
        </div>
    );
};

export default ActivationPage;