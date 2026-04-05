import React from 'react';

const Input = ({ 
    label, 
    icon, 
    type = "text", 
    placeholder, 
    error, 
    disabled, 
    ...props 
}) => {
    return (
        <div className={`custom-input-group ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
            {label && <label className="input-label">{label}</label>}
            
            <div className="input-wrapper">
                {icon && (
                    <span className="material-symbols-rounded input-icon">
                        {icon}
                    </span>
                )}
                <input 
                    type={type}
                    className="custom-input"
                    placeholder={placeholder}
                    disabled={disabled}
                    {...props}
                />
            </div>
            
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default Input;