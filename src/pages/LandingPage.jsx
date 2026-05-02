import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {

    const CONTACT_EMAIL = 'ejemplo@gmail.com';
    const MAILTO = `mailto:${CONTACT_EMAIL}?subject=Demo gratuita Obraction&body=Hola, me gustaría solicitar una demo gratuita de Obraction.%0A%0ANombre:%0ATeléfono:%0AMensaje:`;
    const STORAGE_URL = 'http://127.0.0.1:54321/storage/v1/object/public/app/';
    const { isDark } = useTheme();
    let homeImage = isDark ? `${STORAGE_URL}mobile-mockup.gif` : `${STORAGE_URL}mobile-mockup-light.png`;

    const features = [
        {
            title: 'Control de ingresos y gastos por obra',
            desc: 'Registra cada movimiento al momento. Consulta el balance de cualquier obra en segundos — con o sin IVA. Siempre sabes si vas a ganar o a perder antes de que sea tarde.',
            gif: `${STORAGE_URL}listado-obras.jpg`,
            icon: 'euro_symbol'
        },
        {
            title: 'Gestor de tareas por obra',
            desc: 'Anota todo lo que hay que hacer en cada obra. Marca las tareas como realizadas conforme avanzas. Nada se olvida, nada se pierde.',
            gif: `${STORAGE_URL}detalle-obra-light.jpg`,
            icon: 'select_check_box'
        },
        {
            title: 'Panel de control global',
            desc: 'Una vista rápida de todas tus obras activas, su estado y su balance. De un vistazo sabes dónde estás ganando y dónde tienes que poner atención.',
            gif: `${STORAGE_URL}panel-de-control.jpg`,
            icon: 'list'
        },
        {
            title: 'Pensado para el sector',
            desc: 'Sin tecnicismos contables. Sin funciones innecesarias. Directo al grano, como tú trabajas.',
            gif: `${STORAGE_URL}detalle-movimiento-light.gif`,
            icon: 'construction'
        },
    ];

    const problems = [
        'Acabas una obra sin saber si has ganado dinero de verdad.',
        'Tienes facturas por aquí, gastos por allá y apuntes a mano.',
        'Has empezado otra obra y el caos se acumula.',
        'Al final del mes, las cuentas no cuadran y no sabes por qué.',
    ];

    const [visible, setVisible] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (items) => {
                items.forEach(item => {
                    if (item.isIntersecting) setVisible(prev => ({ ...prev, [item.target.dataset.id]: true }));
                });
            },
            { threshold: 0.15 }
        );
        document.querySelectorAll('[data-id]').forEach(element => observer.observe(element));
        return () => observer.disconnect();
    }, []);

    const animate = (id, delay = 0) => ({
        style: {
            opacity: visible[id] ? 1 : 0,
            transform: visible[id] ? 'translateY(0)' : 'translateY(32px)',
            transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        },
        'data-id': id,
    });

    return (
        <div className="landing-page">


            <section className="landing-hero">
                <div className="landing-hero-bg" />
                <div className="landing-hero-content">
                    <div className="landing-hero-badge">Para profesionales de la construcción</div>
                    <img style={{ width: "25em", padding: "30px 0px" }} src={`${STORAGE_URL}obractionlogo1000.png`} alt="Obraction" className="logo-img" />
                    <h1 className="landing-hero-title">
                        Cada obra bajo control.<br />
                        <span className="landing-hero-accent">Sin sorpresas al final.</span>
                    </h1>
                    <p className="landing-hero-sub">
                        La herramienta que necesitabas para saber exactamente cuánto ganas
                        — y cuánto pierdes — en cada obra. En tiempo real.
                    </p>
                    <div className="landing-hero-ctas">
                        <a href={MAILTO} className="landing-btn-primary">Pedir demo gratuita →</a>
                        <a href="#features" className="landing-btn-ghost">Ver cómo funciona</a>
                    </div>
                </div>
                <div className="landing-hero-mockup">
                    <img src={homeImage} alt="Obraction" />
                </div>
            </section>

            <section className="landing-section" id="problema">
                <div className="landing-container">
                    <div {...animate('prob-title')}>
                        <p className="landing-section-label">¿Te suena esto?</p>
                        <h2 className="landing-section-title">El caos de obra tiene solución</h2>
                    </div>
                    <div className="landing-problem-grid">
                        {problems.map((p, i) => (
                            <div key={i} {...animate(`prob-${i}`, i * 0.1)} className="landing-problem-card">
                                <span className="landing-problem-x"><span className='material-symbols-rounded'>x_circle</span></span>
                                <p className="landing-problem-text">{p}</p>
                            </div>
                        ))}
                    </div>
                    <div {...animate('prob-end', 0.4)} className="landing-problem-end">
                        <p>
                            No es falta de profesionalidad.<br />
                            <strong>Es falta de una herramienta pensada para ti.</strong>
                        </p>
                    </div>
                </div>
            </section>

            <section className="landing-section-dark" id="features">
                <div className="landing-container">
                    <div {...animate('feat-title')}>
                        <p className="landing-section-label-light">La solución</p>
                        <h2 className="landing-section-title" style={{ color: '#f1f5f9' }}>
                            Todo lo que necesitas.<br />Nada que no uses.
                        </h2>
                    </div>
                    <div className="landing-features-grid">
                        {features.map((f, i) => (
                            <div key={i} {...animate(`feat-${i}`, i * 0.12)} className="landing-features-card">
                                <div className="landing-features-icon-wrap">
                                    <span className="landing-features-icon material-symbols-rounded">{f.icon}</span>
                                </div>
                                <div>
                                    <h3 className="landing-features-title">{f.title}</h3>
                                    <p className="landing-features-desc">{f.desc}</p>
                                </div>
                                <div className="landing-features-gif">
                                    {f.gif
                                        ? <img src={f.gif} alt={f.title} className="landing-gif-img" />
                                        : <div className="landing-gif-placeholder"><span>próximamente</span></div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-cta-section">
                <div className="landing-container">
                    <div {...animate('cta-mid')}>
                        <h2 className="landing-cta-title">Sin compromisos. Sin tarjeta de crédito.</h2>
                        <p className="landing-cta-desc">
                            Pide una demo gratuita y te la mostramos en directo adaptada a tu forma de trabajar.<br />
                            En 30 minutos sabrás si es para ti.
                        </p>
                        <a href={MAILTO} className="landing-btn-primary">Agendar demo gratuita →</a>
                    </div>
                </div>
            </section>

            <section className="landing-section">
                <div className="landing-container">
                    <div {...animate('test-title')}>
                        <p className="landing-section-label">Lo que dicen nuestros usuarios</p>
                        <h2 className="landing-section-title">Resultados reales</h2>
                    </div>
                    <div className="landing-testimonios-grid">
                        {[
                            { text: '"Antes acababa las obras sin saber si había ganado dinero. Ahora lo sé en todo momento."', name: 'Juan M.', role: 'Autónomo electricista' },
                            { text: '"Llevo el control de 4 obras a la vez y no se me escapa nada. No sé cómo trabajaba antes."', name: 'Carlos R.', role: 'Constructor' },
                            { text: '"Sencillo, rápido y siempre a mano desde el ordenador o el móvil. Justo lo que necesitaba."', name: 'Pedro L.', role: 'Carpintero' },
                        ].map((t, i) => (
                            <div key={i} {...animate(`test-${i}`, i * 0.12)} className="landing-testimonios-card">
                                <p className="landing-testimonios-text">{t.text}</p>
                                <div className="landing-testimonios-author">
                                    <div className="landing-testimonios-avatar">{t.name[0]}</div>
                                    <div>
                                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.name}</strong>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--neutral)', margin: 0 }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-cta-final">
                <div className="landing-cta-final-bg" />
                <div className="landing-container">
                    <div {...animate('cta-final')}>
                        <h2 className="landing-cta-title">
                            ¿Listo para tener el control?
                        </h2>
                        <p className="landing-cta-desc landing-cta-desc--white">
                            Escríbenos y te contactamos en menos de 24 horas.
                        </p>
                        <a href={MAILTO} className="landing-btn-white">Quiero mi demo gratuita →</a>
                    </div>
                </div>
            </section>

        </div>
    )
}


export default LandingPage;