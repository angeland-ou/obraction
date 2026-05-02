import { useState } from 'react';
import Modal from '../components/Modal';

const Footer = () => {
    const CONTACT_EMAIL = 'soporte@obraction.com';
    const MAILTO = `mailto:${CONTACT_EMAIL}?subject=Soporte Obraction&body=Hola, tengo una consulta o un problema con la plataforma.%0A%0ANombre:%0ATeléfono:%0AMensaje:`;
    const STORAGE_URL = 'http://127.0.0.1:54321/storage/v1/object/public/app/';

    const [modalContent, setModalContent] = useState(null);

    const links = [
        { label: "FAQ's", link: "#" },
        { label: "Aviso Legal", text: "..." },
        { label: "Política Privacidad", text: "..." },
        { label: CONTACT_EMAIL, link: MAILTO },
    ];

    const handleClick = (elem) => {
        if (elem.text) {
            setModalContent(elem);
        }
        // Si tiene link, el <a> lo maneja solo
    };

    return (
        <div className="footer">
            <ul>
                {links.map((elem, i) => (
                    <li key={i} className="footer-link">
                        {elem.text ? (
                            <span onClick={() => handleClick(elem)} style={{ cursor: 'pointer' }}>
                                {elem.label}
                            </span>
                        ) : (
                            <a target="_blank" href={elem.link}>{elem.label}</a>
                        )}
                    </li>
                ))}
            </ul>

            <Modal
                isOpen={!!modalContent}
                onClose={() => setModalContent(null)}
                title={modalContent?.label}>
                <p>{modalContent?.text}</p>
            </Modal>

        </div>
    );
}

export default Footer;