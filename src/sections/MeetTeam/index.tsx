'use client';

import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './style.module.scss';
import ACMLogo from '/public/assets/acm-logo.png';

interface BoardMember {
  name: string;
  title: string;
  subteam: 'hackathon' | 'development';
  profile_image?: string;
}

const filterOptions = ['view all', 'hackathon', 'development'] as const;

type FilterOption = (typeof filterOptions)[number];

const getMemberKey = (member: BoardMember) =>
  `${member.subteam}-${member.name}-${member.profile_image ?? ''}`;

const MeetTeam = () => {
  const [board, setBoard] = useState<BoardMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('view all');
  // start from -2 to make index 0 the front-and-center (third) card
  const [activeIndex, setActiveIndex] = useState(-2);
  const [exitingCard, setExitingCard] = useState<{
    member: BoardMember;
    bounds: { left: number; top: number; width: number };
  } | null>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const previousCardPositions = useRef<Map<string, DOMRect> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function fetchBoard() {
      try {
        const response = await fetch(
          'https://acmucsd.com/api/board?team=hackathon&team=development',
          { next: { revalidate: 3600 } }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch board data');
        }

        const data = await response.json();
        setBoard(data.board);
      } catch (e) {
        console.error(e);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBoard();
  }, []);

  useEffect(() => {
    setActiveIndex(-2);
    previousCardPositions.current = null;
    setExitingCard(null);
    if (exitTimer.current) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
  }, [selectedFilter]);

  useEffect(
    () => () => {
      if (exitTimer.current) {
        clearTimeout(exitTimer.current);
      }
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [board, selectedFilter, activeIndex]);

  const filteredBoard = useMemo(() => {
    if (selectedFilter === 'view all') {
      return board.sort((memberA, memberB) => {
        if (memberA.subteam === 'hackathon') {
          if (memberB.subteam === 'hackathon') {
            return 0;
          }

          return -1;
        }

        return 1;
      });
    }

    return board.filter(member => member.subteam === selectedFilter);
  }, [board, selectedFilter]);

  const visibleBoard = useMemo(() => {
    if (!filteredBoard.length) {
      return [];
    }

    const count = Math.min(filteredBoard.length, 5);
    const startIndex = (activeIndex + filteredBoard.length) % filteredBoard.length;

    return Array.from(
      { length: count },
      (_, index) => filteredBoard[(startIndex + index) % filteredBoard.length]
    );
  }, [filteredBoard, activeIndex]);

  const activeCardIndex = Math.floor(visibleBoard.length / 2);

  useLayoutEffect(() => {
    const cards = cardRefs.current;
    const previousPositions = previousCardPositions.current;
    previousCardPositions.current = null;
    const activeMemberKey = visibleBoard[activeCardIndex]
      ? getMemberKey(visibleBoard[activeCardIndex])
      : null;

    if (!previousPositions || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    cards.forEach((card, key) => {
      card.style.zIndex = key === activeMemberKey ? '2' : previousPositions.has(key) ? '1' : '0';

      const previousPosition = previousPositions.get(key);
      if (!previousPosition) {
        card
          .querySelector<HTMLElement>(`.${styles.name}`)
          ?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: 'ease' });
        return;
      }

      const currentPosition = card.getBoundingClientRect();
      const deltaX = previousPosition.left - currentPosition.left;
      const deltaY = previousPosition.top - currentPosition.top;

      if (deltaX || deltaY) {
        card.animate(
          [{ transform: `translate(${deltaX}px, ${deltaY}px)` }, { transform: 'translate(0, 0)' }],
          { duration: 450, easing: 'ease' }
        );
      }
    });

    const zIndexReset = window.setTimeout(() => {
      cards.forEach(card => {
        card.style.zIndex = '';
      });
    }, 450);

    return () => {
      window.clearTimeout(zIndexReset);
      cards.forEach(card => {
        card.style.zIndex = '';
      });
    };
  }, [activeIndex, activeCardIndex, visibleBoard]);

  const captureCardPositions = (outgoingMember: BoardMember) => {
    previousCardPositions.current = new Map(
      Array.from(cardRefs.current, ([key, card]) => [key, card.getBoundingClientRect()])
    );

    if (
      filteredBoard.length <= visibleBoard.length ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const outgoingCard = cardRefs.current.get(getMemberKey(outgoingMember));
    if (!outgoingCard) {
      return;
    }

    const bounds = outgoingCard.getBoundingClientRect();
    setExitingCard({
      member: outgoingMember,
      bounds: {
        left: bounds.left + window.scrollX,
        top: bounds.top + window.scrollY,
        width: bounds.width,
      },
    });

    if (exitTimer.current) {
      clearTimeout(exitTimer.current);
    }
    exitTimer.current = setTimeout(() => {
      setExitingCard(null);
      exitTimer.current = null;
    }, 450);
  };

  const handlePrev = () => {
    if (filteredBoard.length < 2) {
      return;
    }

    captureCardPositions(visibleBoard[visibleBoard.length - 1]);
    setActiveIndex(prev => (prev - 1 + filteredBoard.length) % filteredBoard.length);
  };

  const handleNext = () => {
    if (filteredBoard.length < 2) {
      return;
    }

    captureCardPositions(visibleBoard[0]);
    setActiveIndex(prev => (prev + 1) % filteredBoard.length);
  };

  if (isLoading) {
    return (
      <div className={styles.loading} role="status">
        <span className={styles.spinner} aria-hidden="true" />
        <span>Loading team members...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.loadError} role="alert">
        Unable to load team members.
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.header}>Meet the Team</h2>

      <div className={styles.filters} role="tablist" aria-label="Team filters">
        {filterOptions.map(option => (
          <button
            key={option}
            type="button"
            className={`${styles.filter} ${selectedFilter === option ? styles.filterActive : ''}`}
            onClick={() => setSelectedFilter(option)}
            aria-pressed={selectedFilter === option}
          >
            {option}
          </button>
        ))}
      </div>

      <div className={styles.carousel}>
        <button
          type="button"
          className={styles.navButton}
          onClick={handlePrev}
          aria-label="Previous team member"
        >
          ‹
        </button>

        <div className={styles.cards}>
          {exitingCard &&
            createPortal(
              <div
                className={styles.memberCard}
                style={{
                  position: 'absolute',
                  left: exitingCard.bounds.left,
                  top: exitingCard.bounds.top,
                  width: exitingCard.bounds.width,
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              >
                <div className={styles.titleTag}>{exitingCard.member.title}</div>
                <div className={styles.imageFrame}>
                  <img
                    src={exitingCard.member.profile_image || ACMLogo.src}
                    alt=""
                    className={`${styles.image} ${
                      exitingCard.member.profile_image ? '' : styles.defaultImage
                    }`}
                  />
                  <div className={styles.imageOverlay} />
                </div>
                <span className={`${styles.name} ${styles.nameExiting}`}>
                  {exitingCard.member.name}
                </span>
              </div>,
              document.body
            )}
          {visibleBoard.map((member, index) => {
            const isActive = index === activeCardIndex;

            return (
              <div
                key={getMemberKey(member)}
                ref={node => {
                  if (node) {
                    cardRefs.current.set(getMemberKey(member), node);
                  } else {
                    cardRefs.current.delete(getMemberKey(member));
                  }
                }}
                className={`${styles.memberCard} ${isActive ? styles.memberCardActive : ''}`}
              >
                <div className={styles.titleTag} aria-hidden={!isActive}>
                  {member.title}
                </div>

                <div className={styles.imageFrame}>
                  <img
                    src={member.profile_image || ACMLogo.src}
                    alt={member.name}
                    className={`${styles.image} ${member.profile_image ? '' : styles.defaultImage}`}
                  />
                  <div className={styles.imageOverlay} />
                </div>

                <span className={styles.name}>{member.name}</span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.navButton}
          onClick={handleNext}
          aria-label="Next team member"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default MeetTeam;
