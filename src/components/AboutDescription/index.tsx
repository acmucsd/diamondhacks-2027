import Typography from '@/components/Typography';
import styles from './style.module.scss';
import Carousel from '../Carousel';
import ImagePicker from '../ImagePicker';

const AboutDescription: React.FC = () => {
  const images: string[] = [
    '/assets/hackathon1.png',
    '/assets/hackathon2.png',
    '/assets/hackathon3.png',
    '/assets/hackathon4.png',
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>
          What is DiamondHacks?
        </span>
      </div>
      <div className={styles.carouselContainer}>
        <div className={styles.isDesktop}>
          <Carousel images={images} />
        </div>
        <div className={styles.isMobile}>
          <ImagePicker images={images} />
        </div>
      </div>
      <div className={styles.description}>
        <Typography className={styles.info} variant="body/medium">
          Get ready for DiamondHacks, a thrilling
          <span className={styles.emphasis}> 36-hour hackathon</span> tournament organized by the
          Association for Computing Machinery at UCSD. The sharpest minds from universities across
          San Diego will gather to join our magic tournament.
        </Typography>
        <Typography className={styles.info} variant="body/medium">
          Hundreds of hackers will team up to make projects showcasing their skills. Choose from
          different <span className={styles.hacks}>creative tracks</span> and{' '}
          <span className={styles.hacks}>attend workshops </span>
          to refine your craft. Join <span className={styles.emphasis}>social events</span> to make
          alliances with other talented students and celebrate magic!
        </Typography>
        <Typography className={styles.bottomText} variant="body/medium">
          Keep your wand at the ready and your eyes sharp for any tricks along the way. Let’s make
          our mark and cast the ultimate hack!
        </Typography>
      </div>
    </div>
  );
};

export default AboutDescription;
