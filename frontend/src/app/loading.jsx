import Image from 'next/image';

import styles from '@/styles/ui/loading.module.css'; // Style
import logo from '@/assets/logo_entreprise.png'; // Logo

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>  
        <div className={styles.logoWrapper}>
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