// app/loading.jsx
import Image from 'next/image';
import styles from '@/styles/loading.module.css';
// 1. Importez l'image ici
import logo from '@/assets/logo_entreprise.png'; 

export default function Loading() {
  return (
<div className={styles.loadingContainer}>  
      <div className={styles.logoWrapper}>
        {/* 2. Utilisez l'objet importé au lieu d'un chemin texte */}
        <Image 
          src={logo} 
          alt="SmartFlow Loading" 
          width={200} 
          height={200} 
          priority
        />
        <div className={styles.loaderBar}></div>
      </div>
    </div>
  );
}