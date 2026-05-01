import React from 'react';

const Button = ({ 
    layout = 'text-button', // icon-button, text-button, icon-text-button
    icon, 
    label, 
    onClick, 
    className = '', 
    variant = 'primary', // color
    size = '', //  xs, sm, md, lg, circle-xs, circle-sm, circle-md, circle-lg
    info,
    type = 'button'
}) => {
    
    const renderContent = () => {
        switch (layout) {
            case 'icon-button':
                return (
                <>
                    <span className="material-symbols-rounded">{icon}</span>                
                    {info && <span className="button-info">{info}</span>}
                </>
            );
            
            case 'icon-text-button':
                return (
                    <>
                        <span className="material-symbols-rounded">{icon}</span>
                        <span className="button-label">{label}</span>
                        {info && <span className="button-info">{info}</span>}
                    </>
                );
            
            case 'text-button':
            default:
                return (
                <>
                    <span className="button-label">{label}</span>               
                    {info && <span className="button-info">{info}</span>}
                </>
            );
            
        }
    };

    return (
        <button className={`custom-button ${layout} variant-${variant} size-${size} ${className}`} onClick={onClick} type={type}>
            {renderContent()}
        </button>
    );
};

export default Button;