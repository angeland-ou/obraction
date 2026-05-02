import { Routes, Route } from 'react-router-dom';
import App from '../App.jsx';

// Componente de protección
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// Páginas
import RegisterPage from '../pages/Register.jsx';
import LoginPage from '../pages/Login.jsx';
import NotFound from '../pages/NotFound.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Projects from '../pages/Projects.jsx';
import ProjectDetail from '../pages/ProjectDetail.jsx';
import ActivationPage from '../pages/Activation.jsx';
import AddProjectPage from '../pages/AddProject.jsx';
import EditProjectPage from '../pages/EditProject.jsx';
import ClientsPage from '../pages/Clients.jsx';
import AddClientPage from '../pages/AddClient.jsx';
import ClientDetailPage from '../pages/ClientDetail.jsx';
import EditClientPage from '../pages/EditClient.jsx';
import MovementsPage from '../pages/Movements.jsx';
import MovementDetail from '../pages/MovementDetail';
import AddMovementPage from '../pages/AddMovement.jsx';
import EditMovementPage from '../pages/EditMovement.jsx';
import TenantPage from '../pages/TenantDetail.jsx';
import EditTenantPage from '../pages/EditTenant.jsx';
import LandingPage from '../pages/LandingPage.jsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>

        {/* Rutas Públicas */}
        <Route index element={<LandingPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="activate/:token" element={<ActivationPage />} />

        {/* Rutas Privadas Tenant */}
        <Route path="tenant" element={
          <ProtectedRoute><TenantPage /></ProtectedRoute>
        } />
        <Route path="tenant/edit" element={
          <ProtectedRoute><EditTenantPage /></ProtectedRoute>
        } />

        {/* Rutas Privadas Proyectos */}
        <Route path="dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="projects" element={
          <ProtectedRoute><Projects /></ProtectedRoute>
        } />
        <Route path="projects/:id" element={
          <ProtectedRoute><ProjectDetail /></ProtectedRoute>
        } />
        <Route path="add-project" element={
          <ProtectedRoute><AddProjectPage /></ProtectedRoute>
        } />
        <Route path="projects/:id/edit" element={
          <ProtectedRoute><EditProjectPage /></ProtectedRoute>
        } />

        {/* Rutas Privadas Clientes */}
        <Route path="clients" element={
          <ProtectedRoute><ClientsPage /></ProtectedRoute>
        } />
        <Route path="add-client" element={
          <ProtectedRoute><AddClientPage /></ProtectedRoute>
        } />
        <Route path="clients/:id" element={
          <ProtectedRoute><ClientDetailPage /></ProtectedRoute>
        } />
        <Route path="clients/:id/edit" element={
          <ProtectedRoute><EditClientPage /></ProtectedRoute>
        } />

        {/* Rutas Privadas Movements */}
        <Route path="/movements" element={
          <ProtectedRoute><MovementsPage /></ProtectedRoute>
        } />
        <Route path="/movements/:id" element={
          <ProtectedRoute><MovementDetail /></ProtectedRoute>
        } />
        <Route path="/movements/:id/edit" element={
          <ProtectedRoute><EditMovementPage /></ProtectedRoute>
        } />
        <Route path="/add-movement" element={
          <ProtectedRoute><AddMovementPage /></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
        
      </Route>
    </Routes>
  );
};

export default AppRouter;