import { useNavigate } from 'react-router-dom';
import ClientForm from '../components/ClientForm';
import Button from '../components/Button';

const AddClientPage = () => {
    const navigate = useNavigate();
    return (
        <div className="add-client-page">
            <div className="page-header">
                <h1>Nuevo cliente</h1>
                <div className="page-header-buttons">
                    <Button
                        layout="icon-text-button"
                        icon="arrow_back"
                        label="Volver"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                    />
                </div>
            </div>
            <ClientForm
                onSuccess={() => navigate('/clients')}
                onCancel={() => navigate(-1)}
            />
        </div>
    );
};

export default AddClientPage;