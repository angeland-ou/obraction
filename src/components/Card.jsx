const Card = ({ title, value, subtitle }) => {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p>{value}</p>
            {subtitle && <small>{subtitle}</small>}
        </div>
    );
};

export default Card;