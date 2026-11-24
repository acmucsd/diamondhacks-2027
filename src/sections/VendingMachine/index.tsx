'use client';

import { useState } from 'react';
import styles from './style.module.scss';
import Machine from '/public/assets/vending-machine.svg';
import BlueBox from '/public/assets/blue-box.svg';
import BlueBoxSelected from '/public/assets/blue-box-selected.svg';
import GreenBox from '/public/assets/green-box.svg';
import GreenBoxSelected from '/public/assets/green-box-selected.svg';
import PinkBox from '/public/assets/pink-box.svg';
import PinkBoxSelected from '/public/assets/pink-box-selected.svg';

const boxes = [
  {
    name: 'projects',
    image: BlueBox,
    selectedImage: BlueBoxSelected,
    stat: '160+',
    statUnit: 'projects',
  },
  {
    name: 'attendees',
    image: GreenBox,
    selectedImage: GreenBoxSelected,
    stat: '600+',
    statUnit: 'total attendees',
  },
  {
    name: 'prizes',
    image: PinkBox,
    selectedImage: PinkBoxSelected,
    stat: '5,000+',
    statUnit: 'in prizes',
  },
] as const;

const VendingMachine = () => {
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);
  const [infoBox, setInfoBox] = useState(0);

  return (
    <section className={styles.container}>
      <div className={styles.vendingMachine}>
        <h2 className={styles.header}>Hack Mart</h2>
        <Machine />
        <div className={styles.blindBoxContainer}>
          <h3 className={styles.blindBoxHeader}>Our Impact</h3>
          <div className={styles.blindBoxes}>
            {boxes.map(({ name, image, selectedImage }, index) => {
              const isHovered = hoveredBox === index;
              const Box = isHovered ? selectedImage : image;

              return (
                <button
                  key={name}
                  type="button"
                  className={styles.blindBox}
                  onPointerEnter={() => {
                    setHoveredBox(index);
                    setInfoBox(index);
                  }}
                  onPointerLeave={() => setHoveredBox(null)}
                  onFocus={() => {
                    setHoveredBox(index);
                    setInfoBox(index);
                  }}
                  onBlur={() => setHoveredBox(null)}
                  onClick={() => setInfoBox(index)}
                  data-active={isHovered}
                  data-box={name}
                >
                  <Box aria-hidden="true" />
                  <span className={styles.boxName}>{name}</span>
                  <span className={styles.boxLabel}>Blind Box</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className={styles.statsContainer}>
            <p>Over the years we&apos;ve had...</p>
            <p className={styles.stat} data-box={boxes[infoBox].name}>{boxes[infoBox].stat}</p>
            <p className={styles.statUnit}>{boxes[infoBox].statUnit}</p>
        </div>
      </div>
    </section>
  );
};

export default VendingMachine;
