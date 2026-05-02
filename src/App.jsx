import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { TenantProvider } from './context/TenantContext';

const App = () => {
    return (
        <ThemeProvider>
            <TenantProvider>
                <Header />
                <main><Outlet /></main>
                <Footer />
            </TenantProvider>
        </ThemeProvider>
    );
};

export default App;