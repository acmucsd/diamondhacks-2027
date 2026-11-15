import AboutDescription from '@/components/AboutDescription';
import styles from './style.module.scss';

const Room1: React.FC = () => {
  return (
    <section className={styles.container} id="about">
      <AboutDescription />
    </section>
  );
};

export default Room1;
