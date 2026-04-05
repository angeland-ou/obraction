import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthProvider';

import RegisterPage from './pages/Register.jsx'
import LoginPage from './pages/Login.jsx';

import NotFound from './pages/NotFound.jsx'

import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';

import ProjectDetail from './pages/ProjectDetail.jsx';
import ActivationPage from './pages/Activation.jsx';

import './styles/main.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
              } />
            <Route path="projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
              } />
            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
            <Route path="/activate/:token" element={
                <ActivationPage />
                } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
