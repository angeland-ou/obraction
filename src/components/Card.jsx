
const Card = ({
    title,
    subtitle,
    value,
    status,
    badge,
    onClick,
    className = '',
    income,
    expense,
    iva,
    globe
}) => {
    return (
        <div
            className={`card ${status ? `card-status-${status}` : ''} ${onClick ? 'card-clickable' : ''} ${className}`}
            onClick={onClick}
        >
            {/* Globe opcional - tareas pendientes */}
            {globe && (
                <div className="card-globe" style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
                    {globe && (
                        <span>
                            {globe}
                        </span>
                    )}
                </div>
            )}

            {/* Badge con icono opcional */}
            {badge && (
                <div className="card-badge" style={{ backgroundColor: badge.color }}>
                    {badge.icon && (
                        <span className="material-symbols-rounded card-badge-icon">
                            {badge.icon}
                        </span>
                    )}
                </div>
            )}

            {/* Bloque título + subtítulo */}
            <div className="card-body">
                <span className="card-title"><h3>{title}</h3></span>
                {subtitle && <span className="card-subtitle">{subtitle}</span>}
            </div>

            {/* Valores a la derecha */}
            <div className="card-body-right">
                {value !== undefined && value !== null && (
                    <div className="card-value">{value}</div>
                )}

                <div className="card-body-right-details">
                    {income !== undefined && income !== null && income !== '0 €' && (
                        <div className="card-income">{income}</div>
                    )}
                    {expense !== undefined && expense !== null && expense !== '0 €' && (
                        <div className="card-expense">{expense}</div>
                    )}
                    {iva !== undefined && iva !== null && (<div className="card-iva">{iva}</div>)}
                </div>

            </div>
        </div>
    );
};

export default Card;