import Room2 from '@/sections/Room2';
import Hero from '@/sections/Hero';
import Room1 from '@/sections/Room1';
import Chatbot from '@/sections/Chatbot';
import Room3 from '@/sections/Room3';
import styles from './page.module.scss';
import MeetTeam from '@/sections/MeetTeam';
import Sponsors from '@/sections/Sponsors';

export default function Home() {
  return (
    <div className={styles.body}>
      <main className={styles.main}>
        <Hero />
        <Room1 />
        <Room2 />
        <Chatbot />
        <Room3 />
        <MeetTeam />
        <Sponsors />
      </main>
    </div>
  );
}
