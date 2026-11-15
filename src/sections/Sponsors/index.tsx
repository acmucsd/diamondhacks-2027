import Typography from '@/components/Typography';
import styles from './style.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { BRONZE_SPONSORS, GOLD_SPONSORS, NORMAL_SPONSORS } from './sponsors';

const PAPER = '/assets/graph-paper.svg';

const Sponsors: React.FC = () => {
  return (
    <section className={styles.container} id="sponsors">
      <img src={PAPER} alt="" className={`${styles.paper} ${styles.paperTop}`} />
      <div className={styles.paperMiddle}>
        {Array.from({ length: 6 }, (_, i) => (
          <img key={i} src={PAPER} alt="" className={styles.paperBand} />
        ))}
      </div>
      <img src={PAPER} alt="" className={`${styles.paper} ${styles.paperBottom}`} />
      <img src="/assets/winner-guy.svg" alt="" className={styles.winnerGuy} />
      <img src="/assets/redbull-guy.svg" alt="" className={styles.redbullGuy} />
      <div className={styles.content}>
        <Typography variant="display/heavy/small" className={styles.title}>
          Thank you to our sponsors
        </Typography>
        <div className={styles.sponsorLogos}>
          {GOLD_SPONSORS.map(sponsor => (
            <Link href={sponsor.link} key={sponsor.name} target="_blank" rel="noopener noreferrer">
              <Image
                src={`/sponsors/old2/${sponsor.logo}`}
                alt={sponsor.name}
                className={`${styles.sponsorLogo} ${styles.goldSponsorLogo} ${
                  styles[sponsor.name.toLowerCase().replace(/\s/g, '')]
                }`}
                width={200}
                height={100}
              />
            </Link>
          ))}
        </div>
        <div className={styles.sponsorLogos}>
          {BRONZE_SPONSORS.map(sponsor => (
            <Link href={sponsor.link} key={sponsor.name} target="_blank" rel="noopener noreferrer">
              <Image
                src={`/sponsors/old2/${sponsor.logo}`}
                alt={sponsor.name}
                className={`${styles.sponsorLogo} ${styles.bronzeSponsorLogo} ${
                  styles[sponsor.name.toLowerCase().replace(/\s/g, '')]
                }`}
                width={200}
                height={100}
              />
            </Link>
          ))}
        </div>
        <div className={styles.sponsorLogos}>
          {NORMAL_SPONSORS.map(sponsor => (
            <Link href={sponsor.link} key={sponsor.name} target="_blank" rel="noopener noreferrer">
              <Image
                src={`/sponsors/old2/${sponsor.logo}`}
                alt={sponsor.name}
                className={`${styles.sponsorLogo} ${
                  styles[sponsor.name.toLowerCase().replace(/\s/g, '')]
                }`}
                width={200}
                height={100}
              />
            </Link>
          ))}
        </div>
        <Typography variant="headline/light/small" className={styles.bottomText}>
          Interested in working with us? Reach out down below!
        </Typography>
        <Link
          href="mailto:hackathon@acmucsd.org"
          className={styles.button}
          data-variant="secondary"
        >
          <Typography variant="title/small" className={styles.buttonText}>
            Sponsor DiamondHacks!
          </Typography>
        </Link>
      </div>
    </section>
  );
};

export default Sponsors;
