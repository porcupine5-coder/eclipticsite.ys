import styles from './LiquidBackground.module.css';

const LiquidBackground = () => {
    return (
        <div className={styles.liquidContainer}>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>
            <div className={`${styles.blob} ${styles.blob3}`}></div>
            <div className={`${styles.blob} ${styles.blob4}`}></div>
        </div>
    );
};

export default LiquidBackground;
