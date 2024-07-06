import './styles/style.css';
import { gsap } from "gsap";
import Splitting from "https://unpkg.com/splitting/dist/splitting.min.js";

document.addEventListener('DOMContentLoaded', () => {
  const threadsDuration = 0.2;
  const garmentsDuration = 0.4;
  const garmentsOverlap = 0.1;

  const titles = document.querySelectorAll('.threads_title-item');
  const triggers = document.querySelectorAll('.threads_trigger-item');
  const garmentItems = document.querySelectorAll('.garment_item');
  const headings = document.querySelectorAll('.h-h6.is-info');
  const paragraphs = document.querySelectorAll('.paragraph.is-info');

  titles.forEach(item => {
    const titleWrap = item.querySelector('.title_wrap');
    gsap.set(titleWrap, { opacity: 0, y: '-100%', visibility: 'hidden' });
  });

  const slideIn = (target) => {
    gsap.killTweensOf(target);
    gsap.fromTo(target, 
      { opacity: 0, y: '-30%', visibility: 'visible' }, 
      { opacity: 1, y: '0%', duration: threadsDuration, ease: 'power2.out' });
  };

  const slideOut = (target) => {
    gsap.killTweensOf(target);
    return gsap.to(target,
      { opacity: 0, y: '30%', duration: threadsDuration, ease: 'power2.in', onComplete: () => {
        target.style.visibility = 'hidden';
      }});
  };

  if (triggers.length > 0) {
    const firstTriggerId = triggers[0].getAttribute('data-threads-id');
    const defaultTarget = document.querySelector(`.threads_title-item[data-threads-id="${firstTriggerId}"] .title_wrap`);
    if (defaultTarget) {
      gsap.set(defaultTarget, { opacity: 1, y: '0%', visibility: 'visible' });
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id = trigger.getAttribute('data-threads-id');
      const target = document.querySelector(`.threads_title-item[data-threads-id="${id}"] .title_wrap`);

      if (target) {
        const tl = gsap.timeline();

        titles.forEach(item => {
          const titleWrap = item.querySelector('.title_wrap');
          if (titleWrap.style.visibility === 'visible') {
            tl.add(slideOut(titleWrap));
          }
        });

        tl.add(() => slideIn(target));
      }
    });
  });

  headings.forEach(heading => {
    gsap.set(heading, { opacity: 0, visibility: 'hidden', y: '-100%' });
  });

  paragraphs.forEach(paragraph => {
    gsap.set(paragraph, { opacity: 0, visibility: 'hidden', y: '-100%' });
    Splitting({ target: paragraph, by: 'lines' });
  });

  if (garmentItems.length > 0) {
    const firstGarmentId = garmentItems[0].getAttribute('data-garment-id');
    const defaultHeading = document.querySelector(`.h-h6.is-info[data-garment-id="${firstGarmentId}"]`);
    const defaultParagraph = document.querySelector(`.paragraph.is-info[data-garment-id="${firstGarmentId}"]`);
    if (defaultHeading && defaultParagraph) {
      gsap.set(defaultHeading, { opacity: 1, visibility: 'visible', y: '0%' });
      gsap.set(defaultParagraph, { opacity: 1, visibility: 'visible', y: '0%' });
    }
  }

  const showContent = (target) => {
    const lines = target.querySelectorAll('.line');
    gsap.killTweensOf(target);
    gsap.fromTo(lines, 
      { opacity: 0, y: '-100%', visibility: 'visible' }, 
      { opacity: 1, y: '0%', duration: garmentsDuration, ease: 'power2.out', stagger: 0.1 });
  };

  const hideContent = (target) => {
    const lines = target.querySelectorAll('.line');
    gsap.killTweensOf(target);
    return gsap.to(lines, 
      { opacity: 0, y: '100%', duration: garmentsDuration, ease: 'power2.in', stagger: 0.1, onComplete: () => {
        target.style.visibility = 'hidden';
      }});
  };

  garmentItems.forEach(item => {
    item.addEventListener('click', () => {
      const garmentId = item.getAttribute('data-garment-id');

      const tl = gsap.timeline();

      headings.forEach(heading => {
        if (heading.style.visibility === 'visible') {
          tl.add(hideContent(heading), 0);
        }
      });

      paragraphs.forEach(paragraph => {
        if (paragraph.style.visibility === 'visible') {
          tl.add(hideContent(paragraph), 0);
        }
      });

      const targetHeading = document.querySelector(`.h-h6.is-info[data-garment-id="${garmentId}"]`);
      const targetParagraph = document.querySelector(`.paragraph.is-info[data-garment-id="${garmentId}"]`);

      if (targetHeading) {
        tl.add(() => showContent(targetHeading), `-=${garmentsOverlap}`);
      }

      if (targetParagraph) {
        tl.add(() => showContent(targetParagraph), `-=${garmentsOverlap}`);
      }
    });
  });
});
