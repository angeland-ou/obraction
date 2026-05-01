import React from 'react';
import Card from './Card';

const BalanceCard = ({
    totalBalance,
    totalIncome,
    totalExpense,
    balanceNoIva,
    incomeNoIva,
    expenseNoIva,
    ivaAmountTotal,
    showSubtitle = true
}) => {
    const fmt = (n) =>
        Number(n).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

    const balancePositive = totalBalance >= 0;
    const balance = balancePositive ? `+ ${fmt(totalBalance)}` : `${fmt(totalBalance)}`;

    return (

        <div className="movements-summary">
                <Card
                    title="Balance total"
                    subtitle={showSubtitle ? `${balanceNoIva} (sin IVA)` : null}
                    value={balance}
                    badge={{ color: balancePositive ? 'var(--color-success)' : 'var(--color-danger)', icon: balancePositive ? 'trending_up' : 'trending_down' }}
                    className='card-centered-vertical card-balance'
                    iva={ivaAmountTotal}
                />
                <div className="block-row">
                    <Card
                        title="Ingresos"
                        subtitle={showSubtitle ? `${incomeNoIva} (sin IVA)` : null}
                        value={fmt(totalIncome)}
                        badge={{ color: '#22c55e', icon: 'trending_up' }}
                    />
                    <Card
                        title="Gastos"
                        subtitle={showSubtitle ? `${expenseNoIva} (sin IVA)` : null}
                        value={fmt(totalExpense)}
                        badge={{ color: '#ef4444', icon: 'trending_down' }}
                    />
                </div>
            </div>
    );
};

export default BalanceCard;