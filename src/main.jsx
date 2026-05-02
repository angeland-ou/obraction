import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import AppRouter from './routes/AppRouter';

import './styles/main.scss';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)