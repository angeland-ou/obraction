import React from 'react';

const Button = ({ 
    layout = 'text-button', // icon-button, text-button, icon-text-button
    icon, 
    label, 
    onClick, 
    className = '', 
    variant = 'primary', // color
    size = '' // tamaño  md o lg
}) => {
    
    const renderContent = () => {
        switch (layout) {
            case 'icon-button':
                return <span className="material-symbols-rounded">{icon}</span>;
            
            case 'icon-text-button':
                return (
                    <>
                        <span className="material-symbols-rounded">{icon}</span>
                        <span className="button-label">{label}</span>
                    </>
                );
            
            case 'text-button':
            default:
                return <span className="button-label">{label}</span>;
        }
    };

    return (
        <button className={`custom-button ${layout} variant-${variant} size-${size} ${className}`} onClick={onClick}>
            {renderContent()}
        </button>
    );
};

export default Button;