// components/dashBordAdmin/stats/StatsWidget.jsx
'use client';

import { Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react'; // Icônes adaptées
import styles from '@/styles/StatsWidget.module.css';

async function getData() {
  // Simule l'appel API
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    totalProducts: 5483,
    orders: 2859,
    totalStock: 5483,
    outOfStock: 38
  };
}

export default async function StatsWidget() {
  const data = await getData();

  const stats = [
    { label: 'Total Products', value: data.totalProducts, icon: Package, color: 'blue' },
    { label: 'Orders',         value: data.orders,        icon: ShoppingCart, color: 'green' },
    { label: 'Total Stock',    value: data.totalStock,    icon: TrendingUp, color: 'teal' },
    { label: 'Out of Stock',   value: data.outOfStock,    icon: AlertTriangle, color: 'red' },
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className={`${styles.statCard} ${styles[stat.color]}`}>
            <div className={styles.iconWrapper}>
              <Icon size={24} />
            </div>
            <div className={styles.textWrapper}>
              <span className={styles.value}>{stat.value.toLocaleString()}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}