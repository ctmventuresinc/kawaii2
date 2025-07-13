import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Main content area */}
      <main className={styles.mainContent}>
        <h1 className={styles.title}>
          Kawaii App
        </h1>
        <p className={styles.subtitle}>
          Mobile-first design with fixed bottom button
        </p>
      </main>
      
      {/* Fixed bottom button */}
      <button className={styles.bottomButton}>
        Tap Me!
      </button>
    </div>
  );
}
