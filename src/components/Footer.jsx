import { useState } from 'react';
import Modal from '../components/Modal';

const Footer = () => {
    const CONTACT_EMAIL = 'soporte@obraction.com';
    const MAILTO = `mailto:${CONTACT_EMAIL}?subject=Soporte Obraction&body=Hola, tengo una consulta o un problema con la plataforma.%0A%0ANombre:%0ATeléfono:%0AMensaje:`;
    const STORAGE_URL = 'http://127.0.0.1:54321/storage/v1/object/public/app/';

    const [modalContent, setModalContent] = useState(null);

    const links = [
        { label: "FAQ's", link: "#" },
        { label: "Aviso Legal", text: "En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se exponen los siguientes datos identificativos del titular de este sitio web: Denominación Social / Nombre: [Nombre completo del autónomo o Nombre de la empresa], NIF/CIF: [DNI, NIF o CIF], Domicilio social: [Dirección postal], Email: [email], Teléfono: [Número de teléfono], Datos de Inscripción: [Reg. Mercantil]. Objeto: Este Aviso Legal regula el uso del sitio web [URL de tu web], del que es titular [Nombre del Titular]. El acceso y/o uso de este sitio web atribuye la condición de usuario, que acepta las condiciones aquí reflejadas. Finalidad: La plataforma no es un sistema de facturación electrónica. Esta aplicación es una herramienta de control interno y gestión de tesorería. No tiene la consideración de Sistema Informático de Facturación (SIF) y no es apta para la expedición de facturas ni para el cumplimiento de obligaciones tributarias oficiales (Ley 11/2021 y Reglamento VeriFactu). Propiedad intelectual: Todos los contenidos de este sitio web (textos, imágenes, logotipos, diseño) son propiedad de [Nombre del Titular] o de sus licenciantes y están protegidos por los derechos de propiedad intelectual e industrial. Queda prohibida su reproducción sin autorización expresa. Responsabilidad: El titular no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo. Enlaces: En el caso de que en este sitio web se dispusiesen enlaces hacia otros sitios de Internet, el titular no ejercerá ningún tipo de control sobre dichos sitios y contenidos. Legislación Aplicable: ara la resolución de todas las controversias o cuestiones relacionadas con este sitio web, será de aplicación la legislación española." },
        { label: "Política Privacidad", text: "Responsable del Tratamiento: Identidad: [Nombre del Responsable/Empresa], NIF/CIF: [Número de Identificación], Dirección: [Dirección Física], Email: [Correo Electrónico de contacto]. 2. Datos Personales RecopiladosRecopilamos información que nos facilitas voluntariamente (nombre, email, teléfono, dirección, etc.) mediante formularios de contacto, registro, suscripción a newsletter o contratación de servicios. 3. Finalidad del Tratamiento: Tus datos se utilizan para: Gestionar la relación comercial o de usuario.Prestar los servicios contratados.Enviar información, comunicaciones comerciales y boletines (si lo autorizas).Responder a consultas y soporte técnico. 4. Legitimación: La base legal para el tratamiento es el consentimiento del usuario (al aceptar esta política), la ejecución de un contrato o el cumplimiento de obligaciones legales. 5. Plazo de Conservación: Los datos se conservarán mientras dure la relación contractual o comercial, y durante los plazos exigidos por ley para posibles responsabilidades. 6. Destinatarios y Transferencias: Los datos no se cederán a terceros, salvo obligación legal. No realizamos transferencias internacionales de datos fuera de la UE sin garantías adecuadas. 7. Derechos del Usuario (RGPD): Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación, oposición y portabilidad, enviando un correo a [Email de contacto]. 8. Medidas de Seguridad: Implementamos medidas técnicas y organizativas para garantizar la confidencialidad, integridad y seguridad de tus datos." },
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